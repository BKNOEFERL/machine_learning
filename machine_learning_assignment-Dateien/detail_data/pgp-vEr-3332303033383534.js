mixinPgp=function(a,c){return function(){this.importStates={imported:"IMPORTED",updated:"UPDATED",invalidated:"INVALIDATED",rejected:"REJECTED"};this.getClient=function(){return a.pgp.getClient()};this.getKeyring=function(){return a.pgp.getKeyring()};this.getAccountId=function(){return a.pgp.getAccountId()};this.getVersion=function(){return a.pgp.getVersion()};this.isValidPublicKeyImportState=function(b){switch(b){case this.importStates.imported:return!0;case this.importStates.updated:return!0;case this.importStates.invalidated:return!1;
case this.importStates.rejected:return!1;default:return!1}};this.postPgpError=function(b,a,d,e){b.version=this.getVersion();c.error(b,a,d,e)};this.pgpInitialize=function(){};this.around("initialize",function(b){a.pgp.initialize().then(function(){b.call(this);this.pgpInitialize()}.bind(this))})}}(phx,phx.util.post);/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, BaseEditor: false, PgpEditor:true, mixinPgp:false, Promise: true */

/**
* @author szucca
*
* This component initialize the pgp editor based on the base editor component.
* At the moment we use the mailvelope browser extension api for our pgp client.
* For further information on mailvelope: http://mailvelope.github.io/mailvelope/index.html
*
*/

PgpEditor = (function ($, defineComponent, BaseEditor, mixinPgp, Wicket) {

/**
* @constructor
*/
return defineComponent({
name: "PgpEditor",
parent: BaseEditor,
mixins: [mixinPgp,

function () {

/**
* Default attributes
*/
this.defaultAttrs({
sendTrigger: '#pgpEditorSendTrigger',
draft: false
});

/**
* Mailvelope editor instance
*
* @type {Null|Object}
*/
this.editor = null;

/**
* Execute the WicketAjax call with the FormData object.
*
* @param {String} requestUrl
* @param {FormData} formData
*/
this.executeWicketAjaxCall = function (requestUrl, formData) {
Wicket.Ajax.post({
"u": requestUrl,
"bsh": [function (attrs, jqXHR, settings) {
settings.data = formData;
}]
});
};

/**
* Execute the editor encrypt promise.
*
* @param {Promise} promise
* @param {String} callbackUrl
*/
this.executeEditorPromise = function (promise, callbackUrl) {
var self = this,
formDataObject = this.createFormData();

promise.then(function (armored) {
formDataObject.append("armored", armored);
}).catch(function (error) {
formDataObject.append("error", error.code);
}).then(function () {
self.executeWicketAjaxCall(callbackUrl, formDataObject);
});
};

/**
* Creates and returns a form data object.
* We need this wrapper make the usage of
* FormData object testable.
*
* @returns {FormData}
*/
this.createFormData = function () {
return new FormData();
};

/**
* Encrypt the current editor instance for all given addresses.
*
* @typedef {Object} MailSubmitData
* @property {Array} addresses          Array of mail addresses
* @property {String} callbackUrl       Resource callback url
*
* @param {jQuery.Event} evt            MailSubmit component event
* @param {MailSubmitData} data         Event data
*/
this.onMailSubmit = function (evt, data) {
if (this.editor) {
var promise = this.editor.encrypt(data.addresses);
this.executeEditorPromise(promise, data.callbackUrl);
}
};

/**
* Saves the current editor content.
*
* @param {jQuery.Event} evt        MailSubmit component event
* @param {Object} data             Event data
*/
this.onMailSave = function (evt, data) {
if (this.editor) {
var promise = this.editor.createDraft();
this.executeEditorPromise(promise, data.callbackUrl);
}
};

/**
* Callback function for generate the pgp editor instance and
* dom initialization.
*
* @param {Object} options          Editor options
* @return {Promise}
*/
this.createPgpEditor = function (options) {
var self = this,
client = this.getClient(),
keyring = this.getKeyring(),
selector = this.attr.editorBody;

return client.createEditorContainer(selector, keyring, options).then(function (editorObject) {
self.onInsertEditorInstance(editorObject);
}).catch(function (err) {
self.postPgpError(err);
});
};

/**
* Returns a promise, which will resolve the
* editor compose options.
*
* When the ajax call fails, the promise is rejected.
*
* @returns {Promise}
*/
this.getComposeOptions = function () {
var url, header, keepAttachments, autoSign, quota;

url = this.attr.bodyUrl;
header = this.attr.quotedHeader;
keepAttachments = this.attr.keepAttachments;
autoSign = this.attr.autoSign;
quota = this.attr.quota;

// This switch prevent an unnecessary ajax call, if the
// url is not defined. The jQuery get method calling themselves
// if the url is null or not defined. In this case we return
// a new resolved promise with an empty object as value.
if(url) {
return Promise.resolve($.get(url)).then(function (data) {
return {
signMsg: autoSign,
quotedMailHeader: header,
quotedMail: data,
quotedMailIndent: true,
keepAttachments: keepAttachments,
quota: quota
};
});
} else {
return Promise.resolve({
signMsg: autoSign,
quota: quota
});
}
};

/**
* Returns a promise, which will resolve the
* editor draft options.
*
* When the ajax call fails, the promise is rejected.
*
* @returns {Promise}
*/
this.getDraftOptions = function () {
var url, autoSign, quota;

url = this.attr.bodyUrl;
autoSign = this.attr.autoSign;
quota = this.attr.quota;

return Promise.resolve($.get(url)).then(function (data) {
return {
signMsg: autoSign,
quota: quota,
armoredDraft: data
};
});
};


/**
* Returns a promise, based on the editor settings.
*
* @returns {Promise}
*/
this.getOptions = function () {
return this.attr.draft ? this.getDraftOptions() : this.getComposeOptions();
};

/**
* This is called when the editor is inserted by the extension. An event
* is triggered to resize the editor header.
*
* It is important to trigger a resize event after initialize and
* insert pgp editor instance, to recalculate the editor body element.
*
* @typedef {Object} MailvelopeEditorObject       Mailvelope editor object
* @property {Function} createDraft
* @property {Function} encrypt
*
* @param {MailvelopeEditorObject} editorObject The editor object of the extension
*/
this.onInsertEditorInstance = function (editorObject) {
this.editor = editorObject;
this.trigger("resize.editor.head");
this.on("mailSubmit", this.onMailSubmit);
this.on("mailSave", this.onMailSave);
};

/**
* After pgp initialize
*/
this.after("pgpInitialize", function () {
var self = this;

this.getOptions().then(function (options) {
self.createPgpEditor(options);
}, function (error) {
Wicket.Log.error(error.message);
});
});
}
]
});

}(jQuery, defineComponent, BaseEditor, mixinPgp, Wicket));
/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, PgpMultiObjectTextField:true, SecureEmailMultiObjectTextField:false */
/*global phx:false, Wicket:false, mixinPgp:false */

/**
* @author szucca
*
* This component extends from SecureEmailMutliObjectTextField, adds all pgp specific code and
* manage the communication between the mailer applicaiton and the pgp client browser extension.
*
* At the moment we use the Mailvelope API.
* For further information on mailvelope: http://mailvelope.github.io/mailvelope/index.html
*
*/

/**
* @typedef {Object} PgpObjectData
* @property {String} id
* @property {String} personalPart
* @property {String} text
* @property {Boolean} isValid
* @property {Boolean} isSecure
* @property {String} pgpKey
* @property {String} pgpKeyState
*/

PgpMultiObjectTextField = (function ($, defineComponent, SecureEmailMultiObjectTextField, mixinPgp, Wicket, emailUtil, CssModifier) {

/**
* @constructor
*/
return defineComponent({
name: "PgpMultiObjectTextField",
parent: SecureEmailMultiObjectTextField,
mixins: [mixinPgp,

function () {

/**
* Default attributes
*/
this.defaultAttrs({
encryptionLabel: ".objectivation-address-write_encryption"
});

/**
* Public key import states of server side service check.
*
* @typedef {Object} pgpImportState
* @property {String} RETURNED
* @property {String} NOT_FOUND
* @property {String} NOT_MODIFIED
*
* @type {pgpImportState}
*/
this.pgpImportState = {
RETURNED: "RETURNED",
NOT_FOUND: "NOT_FOUND",
NOT_MODIFIED: "NOT_MODIFIED"
};

/**
* Data keys for objectivation element.
*
* @typedef {Object} pgpDataKeys
* @property {String} VALIDATION
* @property {String} FINTERPRINT
* @property {String} MODIFICATION
*
* @type {pgpDataKeys}
*/
this.pgpDataKeys = {
VALIDATION: "pgp-valid",
FINGERPRINT: "pgp-fingerprint",
MODIFICATION: "pgp-last-modified"
};

/**
* CSS class modifier for encryption flag.
*
* This modifier is not a part of the css modifier object,
* because it is specific for this component.
*
* @type {String}
*/
this.encryptionCssClass = "is-encrypted";

/**
* Validates an address in relation to the basis of the pgp keyring information.
* After successful validation, the information is stored in the data value of
* the objectivation element.
*
* @param {Function} callback                   Original super function of around override
* @param {PgpObjectData} data                  Pgp specific objectivation data object
* @param {jQuery} s2EntryObj                   jQuery select2 entry object
* @param {jQuery} objectivation                jQuery objectivation element
*/
this.validAddressKey = function (callback, data, s2EntryObj, objectivation) {
var self = this;

this.getKeyring().validKeyForAddress([data.email]).then(function (result) {
self.setEncryptionData(objectivation, data.email, result);
}).catch(function (err) {
self.postPgpError(err);
}).then(function () {
// promise default case
callback.call(self, data, s2EntryObj, objectivation);
});
};

/**
* Sets the encryption data on the objectivation element if the
* result from backend call has valid pgp encrypt information.
*
* @param {jQuery} objectivation                jQuery objectivation element
* @param {String} mailId                       Mail ID
* @param {Object} result                       Validation result from pgp api
*/
this.setEncryptionData = function (objectivation, mailId,  result) {
var encryptData = this.getFirstKeyOfAddressResult(result, mailId);

if(encryptData) {
objectivation.data({
"pgp-valid": true,
"pgp-fingerprint": encryptData.fingerprint,
"pgp-last-modified": encryptData.lastModified
});
}
};

/**
* Returns the first key object with fingerprint and
* last modified information of the result data.
*
* @typedef {Object} PgpKeyData
* @property {String} fingerprint
* @property {String} lastModified
*
* @param {Object} result       Object data
* @param {String} mailId       Mail ID
* @returns {?PgpKeyData}
*/
this.getFirstKeyOfAddressResult = function (result, mailId) {
if(result[mailId].hasOwnProperty("keys")) {
return result[mailId]["keys"][0] || null;
}

return null;
};

/**
* Returns true if the recipient (objectivation) is valid
* and ready for further pgp actions.
*
* @param {jQuery} objectElement        jQuery objectivation element
* @returns {Boolean}
*/
this.isPgpValid = function (objectElement) {
return !!objectElement.data(this.pgpDataKeys.VALIDATION);
};

/**
* Adds the invalid class in the encryption label element.
* We can't use here the native this.select method, because
* at this moment, the element is not attached to the
* component. So we have to access the element directly
* via jquery.
*
* @param {jQuery} element        jQuery objectivation element
*/
this.addInvalidLabelState = function (element) {
element.find(this.attr.encryptionLabel).addClass(CssModifier.IS_INVALID);
};

/**
* Adds the invalid class in the encryption label element.
* For further information, see documenation of addInvalidLabelState.
*
* @param {jQuery} element        jQuery objectivation element
*/
this.removeInvalidLabelState = function (element) {
element.find(this.attr.encryptionLabel).removeClass(CssModifier.IS_INVALID);
};

/**
* Extract the objectivation email address and forward it to
* the pgp invitation button inside the invite flyout.
* The button has a static id. This implementation is not
* the flight way, but at the moment the only way to
* update static flyout content with runtime data.
*
* @param {Element} targetElement      Target element
*/
this.onSetRecipientListOnFlyoutInviteButton = function (targetElement) {
var select2Object, recipientList;

select2Object = $(targetElement).closest(".select2-search-choice").data("select2Data");

recipientList = [];
recipientList.push(emailUtil.getTechnicalAddressFromString(select2Object.id));

$("#PgpInviteFlyoutButton").trigger("set/recipient/list" , [recipientList]);
};

/**
* Callback function for open flyout event.
*/
this.onPgpInviteFlyoutOpen = function (evt) {
this.track("pgp-label-click");
this.select("encryptionLabel").addClass(CssModifier.IS_SELECTED);

this.onSetRecipientListOnFlyoutInviteButton(evt.target);
};

/**
* Callback function for close flyout event.
*/
this.onPgpInviteFlyoutClose = function () {
this.select("encryptionLabel").removeClass(CssModifier.IS_SELECTED);
};

/**
* Callback function for resolved key import and sets the validation
* state on the objectivation element.
*
* @param {String} importState      Import state of public key import
* @param {jQuery} objectElement    Objectivation Element
*
* @see pgp.mixin.js (isValidPublicKeyImportState)
*/
this.onPublicKeyImport = function (objectElement, importState) {
var validationState = this.isValidPublicKeyImportState(importState);
objectElement.data(this.pgpDataKeys.VALIDATION, validationState);
};

/**
* Updates the encryption behavior on the objectivation element.
*
* @param {jQuery} objectElement   Objectivation Element
*/
this.updateEncryptionState = function (objectElement) {
var encryptionLabel = objectElement.find(this.attr.encryptionLabel);

if(this.isPgpValid(objectElement)) {
this.removeInvalidLabelState(objectElement);
} else {
this.addClientSideFlyoutBehavior({
// we can't use here this.select("encryptionLabel"),
// because at this moment, the objectElement is
// unknown for the component.
trigger: encryptionLabel,
options: {
"data-ftd-trigger": "pgpInviteFlyout",
"data-ftd-offset": "-120"
},
onOpen: this.onPgpInviteFlyoutOpen,
onClose: this.onPgpInviteFlyoutClose
});
}

// this resize is important to prevent a layout issue
// in the multi object textfield component (empty row issue).
this.resize();
};

/**
* Imports the public key
*
* @param {String} pubkey           Public key (amored block)
* @param {jQuery} objectElement    Objectivation jQuery element
*/
this.importPublicKey = function (pubkey, objectElement) {
var self = this;

this.getKeyring().importPublicKey(pubkey).then(function (importState) {
self.onPublicKeyImport(objectElement, importState);
}).catch(function (err) {
Wicket.Log.error("Mailvelope: import public key failed: " + err.code);
}).then(function () {
self.updateEncryptionState(objectElement);
});
};

/**
* Override original setAdditionalObjectData function to inject additional
* information to the request data object.
*
* The original function call ist not needed and can be ignored.
*
* @typedef {Object} IdObjectData
* @property {String} fingerPrint       Fingerprint
* @property {String} lastModified      Last modified date
*
* @param {Function} originalCall       Original callback function
* @param {Object} objectData           Object data
*
* @see MultiObjectTextField.getIdObjectData
*
* @returns {IdObjectData}
*/
this.around("getIdObjectData", function (originalCall, objectData) {
return {
fingerPrint: objectData.objectivationElement.data(this.pgpDataKeys.FINGERPRINT),
lastModified: objectData.objectivationElement.data(this.pgpDataKeys.MODIFICATION)
}
});

/**
* Override the initializeObjectQueue function for specific pgp handling.
*
* Connects to pgp client api and store the local encryption information for the given address
* and initialize the object queue for further information from the backend.
*
* Sets the objectivation by default on invalid. On further steps we
* look to the pgp states and switch the state to valid.
*
* @param {Function} initObjectQueue            Original super function of around override
* @param {PgpObjectData} data                  Objectivation data object
* @param {jQuery} s2EntryObj                   jQuery select2 entry object
* @param {jQuery} objectivation                jQuery objectivation element
*
* @see MultiObjectTextField.initializeObjectQueue
*/
this.around("initializeObjectQueue", function (initObjectQueue, data, s2EntryObj, objectivation) {
if (data.email === undefined) {
// try to parse user input
data.email = emailUtil.getTechnicalAddressFromString(data.id) || "";
}

this.addInvalidLabelState(objectivation);

this.validAddressKey(initObjectQueue, data, s2EntryObj, objectivation);
});

/**
* We override this function, because we have to force the server request,
* because the object data needs in any case a server side check.
*
* @param {Function} originalCallback           Override super function of checkDataForQueueRequest
*
* @see MultiObjectTextField.initializeObjectQueue
*/
this.around("checkDataForQueueRequest", function () {
return true;
});

/**
* Add behavior information after successful received information request.
*
* This function is called before the ajax backend call.
*
* @param {jQuery} select2EntryObject           jQuery select2 entry object
* @param {jQuery} objectElement                jQuery objectivation element
* @param {PgpObjectData} data                  Pgp specific objectivation data object
*
* @see SecureEmailMultiObjectTextField.addObjectivationBehavior
*/
this.after("addObjectivationBehavior", function (select2EntryObject, objectElement) {
objectElement.addClass(this.encryptionCssClass);
});

/**
* Update behavior information after successful received information request.
*
* This function is called after the ajax backend call with updated data.
*
* @param {jQuery} s2EntryObj                   jQuery select2 entry object
* @param {jQuery} objectElement                jQuery objectivation element
* @param {PgpObjectData} data                  Pgp specific objectivation data object
*
* @see SecureEmailMultiObjectTextField.updateObjectivationBehavior
*/
this.after("updateObjectivationBehavior", function (select2EntryObject, objectElement, data) {

/**
* At the moment we only have a special case for the
* RETURNED statement. In all other cases we have to update
* the encryption state.
*/
switch(data.pgpKeyState) {
case this.pgpImportState.RETURNED:
this.importPublicKey(data.pgpKey, objectElement);
break;

case this.pgpImportState.NOT_FOUND:
case this.pgpImportState.NOT_MODIFIED:

default: this.updateEncryptionState(objectElement); break;
}
});
}
]
});

}(jQuery, defineComponent, SecureEmailMultiObjectTextField, mixinPgp, Wicket, phx.util.email, CssUtils.modifier));
/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, mixinPgp:false, Wicket:false */

/**
* @author dakr
*
* This component requests the armored block for a PGP mail from the server and initializes
* its display container.
* At the moment we use the mailvelope browser extension api for our pgp client.
* For further information on mailvelope: http://mailvelope.github.io/mailvelope/index.html
*
*/

PgpDisplayContainer = (function ($, defineComponent, mixinPgp, phx, Wicket) {

/**
* @constructor
*/
return defineComponent({
name: "PgpDisplayContainer",
mixins: [mixinPgp,

function () {

/**
* Default attributes
*/
this.defaultAttrs({
pgpBody: ".pgp-body",
url: null,
sender: null
});

/**
* @typedef {Object} PgpDisplayContainerOptions
* @property {String} senderAddress
*
* @returns {PgpDisplayContainerOptions}
*/
this.getContainerOptions = function () {
return {
senderAddress: this.attr.sender
};
};

/**
* Creates the container for displaying the decrypted armored block.
*
* @param {object} data    the response data
*/
this.createDisplayContainer = function (data) {
var self = this,
selector = this.attr.pgpBody,
keyring = this.getKeyring(),
options = this.getContainerOptions();

this.getClient().createDisplayContainer(selector, data, keyring, options).catch(function (err) {
// override the mailvelope code to a static project specific error code.
err.code = "PGP_ENCRYPTION_ERROR";
self.postPgpError(err);
}).then(function () {
phx.closeLayer();
});
};

/**
* On pgp initialize
*/
this.after("pgpInitialize", function () {
var thenHandler = this.createDisplayContainer.bind(this);

phx.showLayerOverlay(true);

$.get(this.attr.url).then(thenHandler, function (error) {
Wicket.Log.error("Ajax request failed: " + error.message);
});
});

}
]
});

}(jQuery, defineComponent, mixinPgp, phx, Wicket));
/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, PgpInvitationTeaser:true, mixinPgp:false, Promise:true */

/**
* @author szucca
*
* Pgp invitation teaser component for import and export of public keys.
*
*/

PgpInvitationTeaser = (function ($, defineComponent, mixinPgp, post) {

/**
* @constructor
*/
return defineComponent({
name: "PgpInvitationTeaser",
mixins: [mixinPgp,

function () {

/**
* Default attributes
*/
this.defaultAttrs({
pubKeyUrl: null
});

/**
* Email address for account owner.
*
* @type {string|null}
*/
this.owner = null;

/**
* Callback function for successful received public key.
* In this case we try import this key in the keyring of
* Mailvelope.
*
* @param {string} pubkey       Pgp public key
*/
this.importRecipientPublicKey = function (pubkey) {
var successfulKeyImport = this.onSuccessfulKeyImport.bind(this),
failedKeyImport = this.postPgpError.bind(this);

this.getKeyring().importPublicKey(pubkey).then(successfulKeyImport, failedKeyImport);
};

/**
* Callback function for successful imported public key. If the importState
* is not valid (rejected or revoked) we have to prevent the public key export.
*
* @param {string} importState          Mailvelope public key import state
*
* @see pgp.mixin.js (isValidPublicKeyImportState)
*/
this.onSuccessfulKeyImport = function (importState) {
var self = this;

if(this.isValidPublicKeyImportState(importState)) {
this.getKeyring().exportOwnPublicKey(this.owner).then(function (pubkey) {
post.message("acceptInvite", pubkey);
}).catch(function (err) {
self.postPgpError(err);
});
}
};

/**
* Gets the public key from the backend over an additional
* ajax call with the given pubKeyUrl.
*
* @param {jQuery.Event} event      DOM Event
* @param {string} email            E-Mail address
*/
this.getRecipientPublicKey = function (event, email) {
var ajaxCall = $.get(this.attr.pubKeyUrl),
importRecipientPublicKey = this.importRecipientPublicKey.bind(this);

this.owner = email;

Promise.resolve(ajaxCall).then(importRecipientPublicKey);
};

/**
* After pgp initialize.
*/
this.after("pgpInitialize", function () {
this.on("importPublicKey", this.getRecipientPublicKey);
});

}]
});

}(jQuery, defineComponent, mixinPgp, phx.util.post));
PgpInvitationAddressChooserPanel=function(f,b,a,d,e){return b({name:"PgpInvitationAddressChooserPanel",mixins:[a,d,function(){this.defaultAttrs({invitationButton:".pgp-invitation-address-chooser-panel_button",addressChooser:".pgp-invitation-address-chooser-panel_address-chooser"});this.triggerRecipientAddOnButton=function(b,a){var c=[];c.push(a.email);this.select("invitationButton").trigger("set/recipient/list",[c])};this.triggerClickOnButton=function(){this.select("invitationButton").trigger("click")};
this.initializeKeyBindings=function(){this.addKey(e.ENTER,this.triggerClickOnButton,{preventInputKeys:!1});this.startKeyListener()};this.initializeEventBindings=function(){this.on(document,"addresschooser/open",this.stopKeyListener);this.on(document,"addresschooser/close",this.startKeyListener);this.on(this.attr.addressChooser,"addresschooser/set/value",this.triggerRecipientAddOnButton)};this.after("pgpInitialize",function(){this.initializeKeyBindings();this.initializeEventBindings()})}]})}(jQuery,
defineComponent,mixinPgp,mixinKeypress,phx.util.KEYS);/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, PgpInvitationButton:true, mixinPgp:false, Button:false */
/*global phx:false, Wicket:false */

/**
* @author szucca
*
* Pgp invitation button component.
*
*/

PgpInvitationButton = (function ($, defineComponent, Button, mixinPgp, mixinTrack, post, Wicket) {

/**
* @constructor
*/
return defineComponent({
name: "PgpInvitationButton",
parent: Button,
mixins: [mixinPgp, mixinTrack,

function () {

/**
* Default attributes
*/
this.defaultAttrs({
ownerAccount: null,
recipientList: []
});

/**
* Sets the given email address as mail account for invitation.
*
* @param {jQuery.Event} event      jQuery custom event
* @param {Array} recipientList     Recipient email address list
*/
this.onSetRecipientList = function (event, recipientList) {
if(Array.isArray(recipientList)) {
this.attr.recipientList = recipientList;
}
};

/**
* Send a backend request to trigger the invitation execution.
*
* @param {String} pubkey           Public key
*/
this.sendInvitation = function (pubkey) {
if(this.attr.recipientList.length > 0) {
post.message("sendInvitation", {
ownPublicKey: pubkey,
recipientList: this.attr.recipientList
});
} else {
Wicket.Log.error("pgp invitation failed by missing recipient mail account");
}
};

/**
* Callback function on button click.
*/
this.onClick = function () {
this.exportPublicKey();
this.track(null, {
recipientCount: this.attr.recipientList.length
});
};

/**
* Exports the own client public key for invite another people and
* send them the public key.
*/
this.exportPublicKey = function () {
var self = this;

this.getKeyring().exportOwnPublicKey(this.attr.ownerAccount).then(function (pubkey) {
self.sendInvitation(pubkey);
}).catch(function (err) {
self.postPgpError(err);
});
};

/**
* After pgp initialize.
*/
this.after("pgpInitialize", function () {
this.on("click", this.onClick);
this.on("set/recipient/list", this.onSetRecipientList);
});
}]
});

}(jQuery, defineComponent, Button, mixinPgp, mixinTrack, phx.util.post, Wicket));
/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, PgpSetupBackupContainer:true, mixinPgp:false */
/*global Promise:false */

/**
* Container for the mailvelope key backup process iFrame.
*
* @author szucca
*/

PgpSetupBackupContainer = (function ($, defineComponent, mixinPgp, post, Wicket) {

/**
* @constructor
*/
return defineComponent({
name: "PgpSetupBackupContainer",
mixins: [mixinPgp,

function () {

/**
* Default attributes
*/
this.defaultAttrs({
recreateBackup: false,
recoveryLogo: false
});

/**
* Returns the selector ID of the container element.
*
* @returns {string} selector
*/
this.getContainerSelector = function () {
return "#" + this.$node.attr("id");
};

/**
* Returns an options object for the container initialization.
*
* @typedef {Object} KeyBackupContainerOptions
* @property initialSetup       Boolean value to indicate, if a backup is available
*
* @returns {KeyBackupContainerOptions}
*/
this.getContainerOptions = function () {
return {
initialSetup: !this.attr.recreateBackup
};
};

/**
* Create backup callback function for mailvelope
* addSyncHandler interface. The callback expect a
* promise.
*
* @typedef {Object} PgpSyncHandlerBackupObject
* @property {String} backup        Armored block
*
* @param {PgpSyncHandlerBackupObject} backupObject
* @returns {Promise}
*/
this.onCreateBackup = function (backupObject) {
return new Promise(function (resolveCallback, rejectCallback) {
$(document).one("afterPgpBackup", function (evt, data) {
// To hand over an error object is a workaround, which could be
// removed again when MAMVELOPE-347 is fixed.
data.success ? resolveCallback() : rejectCallback(new Error());
});

post.message("backup", backupObject.backup, null, rejectCallback);
});
};

/**
* Callback after create key backup container.
* Register a sync handler to mailvelope and
* sends the popup state to the backend.
*
* @param {object} popup        Popup object
*/
this.onCreateContainer = function (popup) {
var self = this;

this.getKeyring().addSyncHandler({
backup: this.onCreateBackup.bind(this)
});

this.setRecoverySheetLogo();

popup.isReady().then(function () {
post.message("backupSheetIsReady");
}).catch(function (err) {
self.postPgpError(err);
});
};

/**
* Defines the global keyring logo which is used in the recovery sheet.
* At the moment we use a static revision, because we don't have a
* revision system and mailvelope updates the logo if the revision  is equal.
*/
this.setRecoverySheetLogo = function () {
this.getKeyring().setLogo(this.attr.recoveryLogo, 1).catch(function (err) {
Wicket.Log.error("set keyring logo failed: " + err.code || err.message);
});
};

/**
* After pgp initialized.
*
* @see pgp.mixin.js
*/
this.after("pgpInitialize", function () {
var self = this,
selector = this.getContainerSelector(),
options = this.getContainerOptions();

this.getKeyring().createKeyBackupContainer(selector, options).then(function (popupObject) {
self.onCreateContainer(popupObject);
}).catch(function (err) {
self.postPgpError(err);
});
});
}
]
});

}(jQuery, defineComponent, mixinPgp, phx.util.post, Wicket));
/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, Wicket:false, Promise:false */
/*global PgpSetupPasswordContainer:true, mixinPgp:false */

/**
* Container for the mailvelope iFrame to display the key generation container.

* @author szucca
*/

PgpSetupPasswordContainer = (function ($, defineComponent, mixinPgp, post) {

/**
* @constructor
*/
return defineComponent({
name: "PgpSetupPasswordContainer",
mixins: [mixinPgp,

function () {

this.defaultAttrs({
email: null,
fullName: null,
keySize: null,
button: "#spButton"
});

/**
* Object for password generation.
*
* @type {object}
*/
this.generator = null;

/**
* Returns the selector ID of the container element.
*
* @returns {string} selector
*/
this.getContainerSelector = function () {
return "#" + this.$node.attr("id");
};

/**
* @typedef {object} UserId
* @property {string} email - the email address of the current user
* @property {string} fullName - the full name of the current user
*/

/**
* Returns the default options for the key generator.
*
* @typedef {object} KeyGeneratorOptions
* @property {Array.<UserId>} userIds
* @property {number} keySize
* @returns {KeyGeneratorOptions}
*/
this.getGeneratorOptions = function () {
return {
userIds: [{
email: this.attr.email.toString(),
fullName: this.attr.fullName.toString()
}],
keySize: parseInt(this.attr.keySize)
};
};

/**
* Returns true, if the generator object is available.
*
* @returns {boolean}
*/
this.hasGenerator = function () {
return !!this.generator;
};

/**
* Enables the action button
*/
this.enableButton = function () {
this.trigger(this.attr.button, "enable");
};

/**
* Disables the action button
*/
this.disableButton = function () {
this.trigger(this.attr.button, "disable");
};

/**
* Callback function for generate password event.
*
* Triggers the generate function on mailvelope side
* and react on the promise cases.
*/
this.onGeneratePassword = function () {
var self = this;

if(this.hasGenerator()) {
this.disableButton();

this.generator.generate().then(function (pubkey) {
post.message("setupsave", pubkey);
}).catch(function (error) {
self.postPgpError(error);
}).then(function () {
self.enableButton();
});
}
};

/**
* Register generation event and keeps the generator
* instance inside the component.
*
* @param {object} generator
*/
this.registerGenerator = function (generator) {
this.generator = generator;
this.on(document, "generate.password", this.onGeneratePassword);
};

/**
* After pgp initialize callback
*/
this.after("pgpInitialize", function () {
var options = this.getGeneratorOptions(),
selector = this.getContainerSelector(),
self = this;

this.getKeyring().createKeyGenContainer(selector, options).then(function (generator) {
self.registerGenerator(generator);
});
});
}
]
});

}(jQuery, defineComponent, mixinPgp, phx.util.post));
/*jslint browser:true, forin:true, nomen:true, plusplus:true, sloppy:true, maxlen:120, indent:4 */
/*global jQuery:false, defineComponent:true, PgpRestorePrivateKeyContainer:true, mixinPgp:false */
/*global Promise:false */

/**
* Container for restore the private and public key pair based on the recovery sheet key.
*
* @author szucca
*/

PgpRestorePrivateKeyContainer = (function ($, defineComponent, mixinPgp, post) {

/**
* @constructor
*/
return defineComponent({
name: "PgpRestorePrivateKeyContainer",
mixins: [mixinPgp,

function () {

this.defaultAttrs({
url: null,
restorePassword: false
});

/**
* Returns the selector ID of the container element.
*
* @returns {string} selector
*/
this.getContainerSelector = function () {
return "#" + this.$node.attr("id");
};

/**
* Restore sync handler for mailvelope sync api.
*
* @returns {Promise}
*/
this.restoreSyncHandler = function () {
var ajax = $.get(this.attr.url);

return Promise.resolve(ajax).then(function (backupArmoredBlock) {
return { backup: backupArmoredBlock };
});
};

/**
* Callback handler after create restore backup container.
*
* @param {restoreContainerObject} backupToMailv       Promise object for restore backup
*/
this.afterCreateRestoreBackupContainer = function (backupToMailv) {
var self = this;

backupToMailv.isReady().then(function () {
post.message("restoredone");
}).catch(function (err) {
self.postPgpError(err);
});
};

/**
* Callback handler after create restore password container.
*
* @param {restoreContainerObject} backupToMailv
*/
this.afterCreateRestorePasswordContainer = function (backupToMailv) {
var self = this;

backupToMailv.isReady().catch(function (err) {
self.postPgpError(err);
});
};

/**
* Callback handler for control the content actions.
*
* @typedef {Object} restoreContainerObject
* @property {Function} isReady
*
* @param {restoreContainerObject} containerObject       Promise container object
*/
this.containerController = function (containerObject) {
this.getKeyring().addSyncHandler({
restore: this.restoreSyncHandler.bind(this)
});

if(this.attr.restorePassword) {
this.afterCreateRestorePasswordContainer(containerObject);
} else {
this.afterCreateRestoreBackupContainer(containerObject);
}
};

/**
* After pgp initialized.
*
* @see pgp.mixin.js
*/
this.after("pgpInitialize", function () {
var selector = this.getContainerSelector(),
containerControler = this.containerController.bind(this),
options = {
restorePassword: this.attr.restorePassword
};

this.getKeyring().restoreBackupContainer(selector, options).then(containerControler);
});
}
]
});

}(jQuery, defineComponent, mixinPgp, phx.util.post));
