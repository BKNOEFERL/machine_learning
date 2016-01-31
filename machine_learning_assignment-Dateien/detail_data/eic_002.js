/**
 * @author United Internet AG
 * @date 19.01.2011
 * @version 0.0.2
 * @revision $Id$
 * @originator alex
 * @maintainer hapf, alex
 * External Iframe Communication (EIC)
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
            var params = com.unitedinternet.eic.params(evt.data),
                frame = com.unitedinternet.eic.frames[params.id*1] || {},
                source = frame.src || frame.qxsrcvalue;
            // ie7 removes protocol; take care of mail dereferrer in newer clients
            if ((!source || com.unitedinternet.eic.toOrigin(source) !== com.unitedinternet.eic.toOrigin(evt.origin || evt.domain)) &&
                !(/^(https?:\/\/|)(mad|)mailderef\.(gmx\.net|gmx\.com|1und1\.de|web\.de|mail\.com)\//.test(source) &&
                /^(https?:\/\/|)(m?ad(client|img)\.uimserv\.net|img.ui-portal.de)(\/|$)/.test(evt.origin || evt.domain))) { return; }
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
