/**
 * @author United Internet AG
 * @date 19.01.2011
 * @version 0.0.2
 * @revision $Id$
 * @originator alex
 * @maintainer hapf, alex
 * External Iframe Communication (EIC)
 * Source: http://js.ui-portal.de/c/eic/eic.js
 * Documentation: http://lxdus02.int.cinetic.de:8220/prod/test/eic.html
 */
(function(){
    com = window.com || {};
    if (!com.unitedinternet) { com.unitedinternet = {}; }
    if (!com.unitedinternet.eic) { com.unitedinternet.eic = {}; }
    com.unitedinternet.eic.version = '0.0.2';
    com.unitedinternet.eic.flashFallback = '//js.ui-portal.de/c/eic/eic-fallback.swf';
    com.unitedinternet.eic.frames = [];
    com.unitedinternet.eic.commands = {};
    // set latency for messages (only if postmessage is not available)
    com.unitedinternet.eic.latency = 500;
    // versatile parameter function obj <==> string
    com.unitedinternet.eic.params = function (url) {
        var result;
        if (!url || typeof(url) == 'string') {
            result = {};
            unescape((url || location.href).replace(/^[^#]*#/, '')).replace(/([^#=]+)=?([^#=]*)/g, function(full, key, value) {
                if (key) { result[key] = value || true; }
            });
            return result;
        } else if (typeof(url) == 'object') {
            if (com.unitedinternet.eic.lcid) { url.lcid = com.unitedinternet.eic.lcid; }
            result = [];
            for (var key in url) {
                if (url.hasOwnProperty(key)) {
                    result.push(escape(key)+'='+escape(url[key]));
                }
            }
            return result.join('#');
        }
        return '';
    }
    com.unitedinternet.eic.id = com.unitedinternet.eic.params().id;
    com.unitedinternet.eic.lcid = com.unitedinternet.eic.params().lcid || (new Date()*1)+''+(Math.random()*1E6);
    if (!window.postMessage && (!window.opera && document.all)) {
        // we need at least Flash 9 for the fallback
        var vr = /^(\D*(\d+\.?\d*)\s*r?(\d*)|\S+\s+(\d+),?(\d*),?(\d*),?\d*)$/, n, e, noflash9 = true;
        if (!/msie\W7/i.test(navigator.userAgent)) {
            try { if (window.ActiveXObject && (n = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) && (e = vr.exec(n.GetVariable('$version')||'')) && parseFloat(e[4]+'.'+e[5]) >= 9) { noflash9 = false; } } catch(e) { }
            if ((n = (navigator.plugins||{})['Shockwave Flash']) && (e = vr.exec((n||0).description||'')) && parseFloat(e[2]) >= 9) { noflash9 = false; }
        }
        if (noflash9) {
            var sendMessage = function() { return; };
        } else {
            var bodyInt = window.setInterval(function() {
                var body;
                if (!(body = document.getElementsByTagName('body')[0] || {}).firstChild) { return; }
                var flash = document.createElement('div');
                var flashurl = com.unitedinternet.eic.flashFallback + '?lcid='+com.unitedinternet.eic.lcid+(com.unitedinternet.eic.id ? '&id='+com.unitedinternet.eic.id : '');
                flash.innerHTML = '<object id="eicFallback" height="1" width="1" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" name="eicFallback" style="position:absolute;width:1px;height:1px;top:-1000px;left:-1000px;"><param name="_cx" value="11906"><param name="_cy" value="11906"><param name="FlashVars" value=""><param name="Movie" value="'+flashurl+'"><param name="Src" value="'+flashurl+'"><param name="WMode" value="window"><param name="Play" value="0"><param name="Loop" value="-1"><param name="Quality" value="High"><param name="SAlign" value=""><param name="Menu" value="-1"><param name="Base" value=""><param name="AllowScriptAccess" value="always"><param name="Scale" value="ShowAll"><param name="DeviceFont" value="0"><param name="EmbedMovie" value="0"><param name="BGColor" value=""><param name="SWRemote" value=""><param name="MovieData" value=""><param name="SeamlessTabbing" value="1"><param name="Profile" value="0"><param name="ProfileAddress" value=""><param name="ProfilePort" value="0"><param name="AllowNetworking" value="all"><param name="AllowFullScreen" value="false"></object>';
                body.insertBefore(flash.getElementsByTagName('object')[0], body.firstChild);
                com.unitedinternet.eic.fallbackListen = function(msg, url){
                    //DEBUG: alert('message received');
                    if (typeof(window.onmessage) == "function") { 
                        window.onmessage({ data: msg, origin: url }); 
                    }
                }
                window.setTimeout(function() {
                    //DEBUG: alert(location.href+': '+typeof(document.getElementById('eicFallback').eicFallbackMessage)+' '+typeof(document.getElementById('eicFallback').eicFallbackListen)+"\nswf-url: "+document.getElementsByTagName('Param')[3].value);
                    if (!com.unitedinternet.eic.id) {
                        document.getElementById('eicFallback').eicFallbackListen();
                    }
                }, 50);
                window.clearInterval(bodyInt);
            }, 15);
            var sendMessage = function(target, msg, url){ 
                if (!document.getElementById('eicFallback') || !typeof(document.getElementById('eicFallback').eicFallbackMessage) == 'function') {                    
                    window.setTimeout(function() { sendMessage(target, msg, url); }, 50);
                    return;
                }
                //DEBUG: alert('message sent');
                document.getElementById('eicFallback').eicFallbackMessage(msg, url);
            };
        }
    } else {
        var sendMessage = function(target, msg, url) { target.postMessage(msg, url); }
    }
    com.unitedinternet.eic.send = function(msg, url, target) {
        var params = com.unitedinternet.eic.params();
        try {
            sendMessage((target || parent), '#lcid='+params.lcid+'#id='+(params.id || '999')+'#'+msg, (url || params.url || ''));
        } catch(e) { }
    }
    com.unitedinternet.eic.toOrigin = function(url) {
        return url.replace(/^(\w+:|)(\/\/|)([^:/]+)(:\d+|).*$/, function(link, protocol, delimiter, host, port) {
            return (protocol || location.protocol) + '//' + host + (port || '');
        });
    }
    com.unitedinternet.eic.listen = function() {
        var e, listener = function(evt) {
            if (!evt) { evt = window.event; }
            // stop IAC messages from being parsed with EIC
            if (!evt || !evt.data || /^IAC\d/.test(evt.data)) { return; }
            if (!evt.data) { return; }
            var params = com.unitedinternet.eic.params(evt.data), 
                frame = com.unitedinternet.eic.frames[params.id*1] || {}, 
                source = frame.src || frame.qxsrcvalue;
            // ie7 removes protocol
            if (!source || com.unitedinternet.eic.toOrigin(source) !== com.unitedinternet.eic.toOrigin(evt.origin || evt.domain)) { return; }
            for (var key in params) {
                if (params.hasOwnProperty(key) && com.unitedinternet.eic.commands[key]) {
                    com.unitedinternet.eic.commands[key].call(frame, params[key]);
                }
            }
        };
        // small construct to set DOM events in FF/IE:
        if (window.postMessage) {
            ((e=window.addEventListener) || window.attachEvent)((e?'':'on')+'message', listener, false);
        } else {        
            window.onmessage = listener;
        }
    }
    com.unitedinternet.eic.domFrame = function(url, attributes, style) {
        var iframe = document.createElement('iframe'), 
            id = com.unitedinternet.eic.frames.length;
        iframe.src = url + '#' + com.unitedinternet.eic.params({ id: id, url: location.href });
        com.unitedinternet.eic.frames[id] = iframe;
        if (!style && attributes.style) {
            style = attributes.style;
            attributes.style = null;
        }
        for (var item in attributes) {
            if (!attributes.hasOwnProperty(item)) continue;
            iframe.setAttribute(item, attributes[item]);
            iframe[item] = attributes[item];
        }
        for (var item in style) {
            if (!attributes.hasOwnProperty(item)) continue;
            iframe.style[item] = attributes[item];
        }
        return iframe;
    }
    com.unitedinternet.eic.writeFrame = function(url, attributes, style) {
        var id = com.unitedinternet.eic.frames.length,
            iframe = com.unitedinternet.eic.domFrame(url, attributes, style);
        document.write('<div id="eicframe'+id+'"></div>');
        var div = document.getElementById('eicframe'+id);
        div.parentNode.replaceChild(iframe, div);
        return iframe;
    }
})();

/*
 * wpt=h
 * UIM Technical Application & Media Management (UIM TAM)
 */
var AdService = {
		flashVersion: 0,
		// compute flashVerion only if needed
		computeFlashVersion: function () {
			if (this.flashVersion === 0) {
				var v, p = window.navigator && navigator.plugins && navigator.plugins['Shockwave Flash'];
				if (p) {
					v = p.description;
				} else {
					try {
						v = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
					} catch (e) {}
				}
				this.flashVersion = (/\d/).test(v) ? +v.match(/\d{1,2}/)[0] : -1;
			}
		},
		param: function (obj) {
			var i, pa = [];
			for (i in obj) {
				if (obj.hasOwnProperty(i) && obj[i]) {
					pa.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
				}
			}
			return pa.join('&');
		},
		handleData: {
			sitebar: function (conf) {
				//standard
				var data = {
					type : conf.type,
					minFlashVersion : conf.minFlashVersion,
					quality : conf.quality,
					swLiveConnect : conf.swLiveConnect,
					wmode : conf.wmode,
					base : conf.base,
					clickUrl : conf.clickUrl,
					count : conf.count,
					//truecount : conf.truecount,
					flashVars : conf.flashVars,
					flash : conf.flash,
					fallback : conf.fallback,
					fallbackWidth : conf.fallbackWidth,
					fallbackHeight : conf.fallbackHeight,
					closeFunction : conf.closeFunction,
					salign : conf.salign,
					onload : conf.onload,
					bgcolor : conf.bgcolor,
					iframeUrl : conf.iframeUrl,
					sitebar : conf.sitebar,
					components : conf.components
				};
				//custom overwrite
				if(typeof data.components === 'object'){
					for(var index in data.components) {
						data[index] = data.components[index];
					}
				}
				if(typeof data.sitebar === 'object'){
					for(var index in data.sitebar) {
						data[index] = data.sitebar[index];
					}
				}
				//general overwrite
				data.minFlashVersion = data.minFlashVersion || 10;
				data.wmode = data.wmode || 'opaque';
				data.quality = data.quality || 'high';
				data.swLiveConnect = data.swLiveConnect || 'true';
				data.onload = data.onload || 'true';
				data.closeFunction = data.closeFunction || 'iab_hide2';
				data.base = data.base ? (/^https?:/.test(data.base) ? '' : location.protocol) + data.base : '';
				data.flashVars = typeof data.flashVars === 'object' || typeof data.flashVars === 'string' ? data.flashVars : {'clicktag':'{clickurl}','clicktarget': '_blank'};
				data.flashVars.clicktag = data.flashVars.clicktag || '{clickurl}';
				data.flashVars.clicktarget = data.flashVars.clicktarget || '_blank';
				data.flashVars = (typeof data.flashVars === 'object' ? AdService.param(data.flashVars) : data.flashVars).replace(new RegExp(encodeURIComponent('{clickurl}'),'gi'), function () { return encodeURIComponent(data.clickUrl); });
				//buildAd
				AdService.buildAd[data.type](data);
			}
		},
		buildAd: {
			sitebar: function (conf) {
				var html, a, img, sitebarId = Math.round(1000000 * Math.random()),
					sitebarElem = document.createElement('div');
				sitebarElem.style.height = '100%';
				sitebarElem.style.width = '100%';
				sitebarElem.style.position = 'absolute';
				sitebarElem.style.overflow = 'hidden';
				document.getElementsByTagName('body')[0].appendChild(sitebarElem);
				if (conf.iframeUrl) {
					var iframewidth = conf.fallbackWidth || '100%';
					var iframeheight = conf.fallbackHeight || '100%';
					html = '<iframe id="sitebarObject_' + sitebarId + '" src="'+(conf.iframeUrl.replace(/&/g, '&amp;'))+'" width="' + iframewidth + '" height="' + iframeheight + '" frameborder="0" border="0" scrolling="no" marginwidth="0" marginheight="0"><\/iframe>';
					sitebarElem.innerHTML = html;
				}
				else if (conf.flash && AdService.flashVersion >= conf.minFlashVersion) {
					html = '<object name="sitebarObject' + sitebarId + '" id="sitebarObject_' + sitebarId + '" type="application/x-shockwave-flash" data="' + conf.flash + '" style="width: 100%; height: 100%;">';
					html += '<param name="movie" value="' + conf.flash + '" />';
					html += '<param name="quality" value="' + conf.quality + '" />';
					html += '<param name="wmode" value="' + conf.wmode + '" />';
					html += '<param name="swliveconnect" value="' + conf.swLiveConnect + '" />';
					html += '<param name="allowscriptaccess" value="always" />';
					if (conf.base) {
						html += '<param name="base" value="' + conf.base + '" />';
					}
					if (conf.salign) {
						html += '<param name="salign" value="' + conf.salign + '" />';
					}
					if (conf.bgcolor) {
						html += '<param name="bgcolor" value="' + conf.bgcolor + '" />';
					}
					if (conf.flashVars) {
						html += '<param name="flashvars" value="' + conf.flashVars + '" />';
					}
					html += '<\/object>';
					sitebarElem.innerHTML = html;
				} else {
					a = document.createElement('a');
					a.href = conf.clickUrl;
					a.target = '_blank';
					img = document.createElement('img');
					if (conf.fallbackWidth) {
						img.width = conf.fallbackWidth;
					}
					if (conf.fallbackHeight) {
						img.height = conf.fallbackHeight;
					}
					img.border = '0';
					img.src = conf.fallback;
					img.style.maxWidth = "100%";
					img.style.maxHeight = "100%";
					a.appendChild(img);
					sitebarElem.appendChild(a);
				}
				if (conf.closeFunction) {
					window[conf.closeFunction] = function () {
						sitebarElem.style.display = 'none';
					};
				}
				if (conf.onload && conf.count) {
					var i, c = conf.count;
					for (i in c) {
						if (c.hasOwnProperty(i) && c[i]) {
							(new Image()).src = c[i];
						}
					}
				}
			}
		},
		createAd: function (conf) {
			this.computeFlashVersion();
			if (conf.type==="sitebar") {
				AdService.handleData[conf.type](conf);
			}
		},
		disablePosition: function () {},
		moveAdToPosition: function () {},
		adMetaHooks: [],
		adMeta: function (obj) {
			var hook,
				amhs = this.adMetaHooks,
				amhsh,
				conditionCheck,
				con;
			for (hook in amhs) {
				if (amhs.hasOwnProperty(hook)) {
					amhsh = amhs[hook];
					conditionCheck = true;
					for (con in amhsh.conditionObj) {
						if (amhsh.conditionObj.hasOwnProperty(con) && conditionCheck) {
							if (typeof amhsh.conditionObj[con] === 'string') {
								conditionCheck = amhsh.conditionObj[con] === obj[con];
							} else if (amhsh.conditionObj[con] instanceof RegExp) {
								conditionCheck = amhsh.conditionObj[con].test(obj[con]);
							} else {
								conditionCheck = false;
							}
						}
					}
					if (conditionCheck) {
						amhsh.callback(obj);
					}
				}
			}
		},
		onAdMeta: function (co, cb) {
			this.adMetaHooks.push({
				conditionObj: co,
				callback: cb
			});
		}
	},
	$ = {
		param: AdService.param
	};
/* Resize Inbox Skyscraper/Top/Rectangle */
AdService.onAdMeta({
	category: 'mail',
	section: /^freemail\/3cmail_fm\//,
	tagid: /^(top|sky_right|rectangle_?2?)$/
}, function (adMetaData) {
	var es;
	if (/#id=\S+#url=\S+#lcid=/.test(location.href)) {
		es = 'resize=' + adMetaData.adsize;
		// es = 'resize=' + adMetaData.adsize + '#dv=cuid:' + adMetaData.cuid + ',cid:' + adMetaData.cid + ',bid:' + adMetaData.bid;
		com.unitedinternet.eic.send(es);
		try {
			console.log(es);
		} catch (e) {}
		window.on = window.addEventListener ? function(ev, func) { window.addEventListener(ev, func); } : function(ev, func) { window.attachEvent('on'+ev, func); };
		window.on("load", function() {
			if (document.getElementsByTagName("uim:ad").length === 2 && typeof document.getElementsByTagName("uim:ad")[1] === 'object' && document.getElementsByTagName("uim:ad")[1].getAttribute("tagid") === 'appnexus'){
				var uim_ad_width = document.getElementsByTagName("uim:ad")[1].getAttribute("width"),
					uim_ad_height = document.getElementsByTagName("uim:ad")[1].getAttribute("height"),
					es = 'resize=' + uim_ad_width + 'x' + uim_ad_height;
				com.unitedinternet.eic.send(es);
			} else if (document.getElementsByTagName("iframe").length === 1 && typeof document.getElementsByTagName("iframe")[0] === 'object' && document.getElementsByTagName("iframe")[0].getAttribute("src").match(/.*adnxs\.com.*/)){
				var uim_ad_width = document.getElementsByTagName("iframe")[0].getAttribute("width"),
					uim_ad_height = document.getElementsByTagName("iframe")[0].getAttribute("height"),
					es = 'resize=' + uim_ad_width + 'x' + uim_ad_height;
				com.unitedinternet.eic.send(es);
			}
		});
	}
});
/* Disable Scrollbar Freemail-Start */
AdService.onAdMeta({
	category: 'mail',
	section: 'freemail/navigator/td_fm/homepage',
	tagid: 'sky_right'
}, function (adMetaData) {
	'use strict';
	if (/#id=\S+#url=\S+#lcid=/.test(location.href)) {
		var scrolloverflow = function () {
			document.getElementsByTagName('body')[0].style.overflow = 'hidden';
		};
		if (window.addEventListener) {
			window.addEventListener('DOMContentLoaded', function () {
				scrolloverflow();
			});
		} else if (document.attachEvent) {
			document.attachEvent('onreadystatechange', function () {
				if (document.readyState === 'complete') {
					scrolloverflow();
				}
			});
		}
	}
});
/* Resize/Show Billboard Freemail-Start */
AdService.onAdMeta({
	category: 'mail',
	section: 'start',
	tagid: 'top'
}, function (adMetaData) {
	var es;
	if (/#id=\S+#url=\S+#lcid=/.test(location.href)) {
		es = 'resize=' + adMetaData.adsize;
		com.unitedinternet.eic.send(es);
		try {
			console.log(es);
		} catch (e) {}
	}
});
/* AdService.onAdMeta({
	category: 'mail',
	section: 'freemail/navigator/td_fm/homepage',
	tagid: /^(top|sky_right|multicall_1)$/
}, function (adMetaData) {
	var es;
	if (/#id=\S+#url=\S+#lcid=/.test(location.href)) {
		es = 'dv=cuid:' + adMetaData.cuid + ',cid:' + adMetaData.cid + ',bid:' + adMetaData.bid;
		com.unitedinternet.eic.send(es);
		try {
			console.log(es);
		} catch (e) {}
	}
}); */