/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, phx:true, Promise:false */

(function($, phx, post) {

/**
* local promises store
*/
var promises = {
fingerprint: null,
accountId: null,
mailvelope: null,
environment: null
};

/**
* Time in seconds, which waits waits for mailvelope
* before we reject the promise.
*
* This value can be overwritten by the public function:
*
* phx.pgp.setMailvelopeTimeout(seconds)
*
* @type {Number}
*/
var mailvelopeCheckTimer = 3;

/**
* Local scope cache for pgp environment objects.
*
* @typedef {Object} PgpEnvironment
* @property {PgpClient} mailvelope
* @property {PgpKeyring} keyring
* @property {String} accountId
* @property {String} version
* @property {String} fingerprint
* @property {Boolean} hasKeyPair
*
* @type {?PgpEnvironment}
*/
var environmentCache = null;

/**
* Private Client Wrapper API
*
* @typedef {Object} PgpClientWrapperPrivateApi
* @property {Function} checkMailvelope
* @property {Function} checkFingerprint
* @property {Function} checkAccountId
* @property {Function} checkMailvelopeVersion
* @property {Function} checkKeyring
* @property {Function} checkKeyPair
* @property {Function} checkEnvironment
* @property {Function} addSyncHandler
* @property {Function} uploadSyncPromise
* @property {Function} downloadSyncPromise
* @property {Function} isPgpEnvironmentReady
* @property {Function} onDisconnect
*
* @type {PgpClientWrapperPrivateApi}
*/
var pgp = {

/**
* Check if mailvelope is already injected and available.
* If the mailvelope object is not available, we resolve
* the promise with null.
*
* For more information please read the comment:
* @see this.checkEnvironment
*
* @returns {Promise}
*/
checkMailvelope: function () {
if(!promises.mailvelope) {
promises.mailvelope = new Promise(function (resolve) {
if (typeof mailvelope !== "undefined") {
resolve(mailvelope);
} else {
var timer = window.setTimeout(function () {
resolve(null);
}, mailvelopeCheckTimer * 1000);

$(window).on("mailvelope", function () {
clearTimeout(timer);
resolve(mailvelope);
});
}
});
}

return promises.mailvelope;
},

/**
* Checks the fingerprint identifier.
*
* For more information please read the comment:
* @see this.checkEnvironment
*
* @returns {Promise}
*/
checkFingerprint: function() {
if(!promises.fingerprint) {
promises.fingerprint = new Promise(function (resolve) {
var fingerprint = phx.getVar("ownKeyFp");
fingerprint ? resolve(fingerprint) : resolve(null);
});
}

return promises.fingerprint;
},

/**
* Checks the pgp accountId
*
* For more information please read the comment:
* @see this.checkEnvironment
*
* The timeout is important to prevent a race condition issue.
* We need this timeout only for the case, if you run the
* pgp setup wizard forthe first time. At this time, the user
* don't have a pgp account id and the id will be generated when
* the dialog opens. The backend response of this request answer
* runs after the flight initialize function and to this time
* the pgp account id is currently undefined. With this timeout
* we can be sure that the promise will be resolved after the
* pgp account id is defined.
*
* @returns {Promise}
*/
checkAccountId: function () {
if(!promises.accountId) {
promises.accountId = new Promise(function (resolve) {
setTimeout(function() {
var id;
id = phx.getVar("pgpAccountId");
id ? resolve(id) : resolve(null);
}, 0);
});
}

return promises.accountId;
},

/**
* Checks the mailvelope client version.
*
* For more information please read the comment:
* @see this.checkEnvironment
*
* @returns {Promise}
*/
checkMailvelopeVersion: function () {
return this.checkMailvelope().then(function (mailv) {
return mailv.getVersion();
}).catch(function () {
return null;
});
},

/**
* Checks the mailvelope keyring object based on the account id.
*
* For more information please read the comment:
* @see this.checkEnvironment
*
* @returns {Promise}
*/
checkKeyring: function () {
var self = this;

return self.checkMailvelope().then(function (mailv) {
return self.checkAccountId().then(function (id) {
return mailv.getKeyring(id).catch(function () {
return mailv.createKeyring(id);
});
});
}).catch(function () {
return null;
});
},

/**
* Checks a valid key pair inside the keyring based on a fingerprint.
*
* For more information please read the comment:
* @see this.checkEnvironment
*
* @returns {Promise}
*/
checkKeyPair: function () {
var self = this;

return self.checkFingerprint().then(function (fingerprint) {
return self.checkKeyring().then(function (keyring) {
return keyring.hasPrivateKey(fingerprint);
});
}).catch(function () {
return false;
});
},

/**
* Checks all whole environment and returns a object
* with all information.
*
* At the moment, we use this kind of promise
* in a different way as expected. In this function,
* we try to resolve all information, which are
* important for the configuration on client and
* server side.
*
* All check functions return a resolved promise
* with a specific value or null. CheckEnvironment
* returns a object with all states.
*
* A reject is at the moment not implemented.
*
* @returns {Promise}
*/
checkEnvironment: function () {
return Promise.all([
pgp.checkFingerprint(),
pgp.checkAccountId(),
pgp.checkMailvelope(),
pgp.checkKeyring(),
pgp.checkKeyPair(),
pgp.checkMailvelopeVersion()
]).then(function (values) {
environmentCache = {
fingerprint: values[0],
accountId: values[1],
mailvelope: values[2],
keyring: values[3],
hasKeyPair: values[4],
version: values[5]
};

return environmentCache;
});
},

/**
* Adds mailvelope up-/download sync handler.
*/
addSyncHandler: function () {
if (phx.getVar("pgpKeySyncActive")) {
environmentCache.keyring.addSyncHandler({
uploadSync: this.uploadSyncPromise,
downloadSync: this.downloadSyncPromise
});
}
},

/**
* Returns a promise which triggers the public postMessage event.
*
* To resolve the promise, we wait for an event which is triggered
* on successful backend side.
*
* @typedef {Object} PgpUploadSyncObject
* @property {String} eTag
* @property {String} keyringMsg
*
* @param {PgpUploadSyncObject} uploadSyncObject
* @returns {Promise}
*/
uploadSyncPromise: function (uploadSyncObject) {
return new Promise(function (resolve, reject) {
post.message("uploadSync", {
eTag: uploadSyncObject.eTag,
pubKeyring: uploadSyncObject.keyringMsg
});

$(document).one("afterPgpUploadSync", function (event, data) {
var result = {
eTag: data.eTag
};

data.eTag ? resolve(result) : reject("eTag not specified");
});
});
},

/**
* Returns a promise which calls a backend resource
* to resolve this with the current pgp backup. On ajax<
* failure we reject the promise.
*
* @typedef {Object} PgpDownloadSyncObject
* @property {String} eTag
* @property {String} keyringMsg
*
* @param {PgpDownloadSyncObject} downloadSyncObject
* @returns {Promise}
*/
downloadSyncPromise: function (downloadSyncObject) {
var ajaxCall, ajaxUrl;

ajaxUrl = phx.getVar("pgpDownloadSyncUrl");
ajaxCall = $.get(ajaxUrl, {
eTag: downloadSyncObject.eTag
});

return Promise.resolve(ajaxCall).then(function (dataString) {
var json = JSON.parse(dataString);

return {
keyringMsg: json.keyring,
eTag: json.eTag
};
}).catch(function (err) {
return Promise.reject(err.statusText);
});
},

/**
* Returns true, if the pgp environment is ready for all main actions.
*
* @returns {Boolean}
*/
isPgpEnvironmentReady: function () {
return !!(environmentCache && environmentCache.mailvelope && environmentCache.keyring);
},

/**
* Callback function for mailvelope disconnect event
*
* @param {jQuery.Event} evt
*/
onDisconnect: function (evt) {
post.message("updated", evt.originalEvent.detail);
}


};

/**
* Public API
*
* @typedef {Object} PgpWrapper
* @property {function} initialize
* @property {function} reinitialize
* @property {function} getClient
* @property {function} getKeyring
* @property {function} getAccountId
* @property {function} getVersion
* @property {function} setMailvelopeTimeout
* @property {function} isExtensionInstalled
* @type {PgpWrapper}
*/
phx.pgp = {

/**
* Initialize the pgp environment and returns a resolved promise
* if all environment checks are successful finished.
*
* @returns {Promise}
*/
initialize: function () {
if(!promises.environment) {
promises.environment = new Promise(function (resolve) {
if(environmentCache) {
resolve(environmentCache);
} else {
pgp.checkEnvironment().then(function (environment) {
if(pgp.isPgpEnvironmentReady()) {
pgp.addSyncHandler();
}

resolve(environment);
});
}
});
}

return promises.environment;
},

/**
* Resets all predefined caches and initialize
* again the pgp environment.
*
* @returns {Promise}
*/
reinitialize: function () {
promises.accountId = null;
promises.environment = null;
promises.fingerprint = null;
promises.mailvelope = null;
environmentCache = null;

return this.initialize();
},

/**
* Returns the pgp client (mailvelope) object.
*
* @typedef {object} PgpClient
* @property {function} getVersion
* @property {function} getKeyring
* @property {function} createKeyring
* @property {function} createDisplayContainer
* @property {function} createEditorContainer
* @property {function} createSettingsContainer
*
* @returns {?PgpClient}       Mailvelope object
*/
getClient: function () {
return (environmentCache && environmentCache.mailvelope) || null;
},

/**
* Returns the mailvelope keyring object.
*
* @typedef {object} PgpKeyring
* @property {function} validKeyForAddress
* @property {function} exportOwnPublicKey
* @property {function} importPublicKey
* @property {function} setLogo
* @property {function} createKeyGenContainer
* @property {function} createKeyBackupContainer
* @property {function} restoreBackupContainer
* @property {function} hasPrivateKey
* @property {function} addSyncHandler
* @property {function} openSettings
*
* @returns {?PgpKeyring}       Mailvelope keyring object
*/
getKeyring: function () {
return (environmentCache && environmentCache.keyring) || null;
},

/**
* Returns the pgp Account ID.
*
* @return {?String}       pgp Account ID
*/
getAccountId: function () {
return (environmentCache && environmentCache.accountId) || null;
},

/**
* Returns the mailvelope verison.
*
* @returns {?String}
*/
getVersion: function () {
return (environmentCache && environmentCache.version) || null;
},

/**
* Sets the timeout for mailvelope detection.
*
* @param {Number} seconds
*/
setMailvelopeTimeout: function (seconds) {
if(seconds) {
mailvelopeCheckTimer = seconds;
}
},

/**
* Returns a promise which resolve when the
* mailvelope browser extension is detectable.
* Otherwise the promise will be rejected.
*
* For extension detection, we use a resource image
* call, which returns a stable indicator on load or
* error callback.
*
* returns {Promise}
*/
isExtensionInstalled: function () {
return new Promise(function (resolve, reject) {
var srcUrl = phx.getVar("pgpExtensionCheckUrl");

/**
* This exceptional code is a temporary implementation
* to ignore the extension detection. At the moment
* the mailvelope nightly builds doesn't have a static
* extension ID. So it's not possible to detect
* instantly the extension and we have to initiate
* the timeout detection. The IAC script implements
* after a successful resolve a pgp.initialize and
* try to detect the extension based on the defined
* timeout.
*
* This workaround will be removed, if the upcoming
* chrome nightly builds will have a static extension ID.
*
* For your information: this issue is chrome specific.
*/
if(!srcUrl) {
resolve();
}

var img = new Image();
img.onload = resolve;
img.onerror = reject;
img.src = srcUrl || "";
});
}
};

/**
* Global event listener
*/
$(window).on("mailvelope-disconnect", pgp.onDisconnect);

}(jQuery, phx, phx.util.post));
