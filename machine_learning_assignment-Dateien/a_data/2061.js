var NSfTIF=window.NSfTIF||{};NSfTIF.cnr=2061;NSfTIF.pid=284;NSfTIF.reset=function(){NSfTIF.origin="NSfTIF";NSfTIF.pType="CP";
NSfTIF.section="undef/undef";NSfTIF.tax_id="1";NSfTIF.cr="";NSfTIF.sktg="Diverse/Diverse/Diverse";NSfTIF.keyword="";NSfTIF.cc="de";
NSfTIF.rc="de";NSfTIF.mandant="uid";NSfTIF.pTypeUid="AP";NSfTIF.frabo=true;NSfTIF.has_ads=true;NSfTIF.options={}};NSfTIF.reset();
NSfTIF.uidPixeltypeList={AP:"AP",CP:"CP",NP:"NP",SP:"SP",XP:"XP"};NSfTIF.sectionList={"/freemail/navigator/cl_fm/office/":"320","/freemail/navigator/hr_fm/office/":"320","/freemail/navigator/hr_pm/office/":"320","/freemail/products/mail/comsaddressbook/":"320","/freemail/navigator/cl_pm/office/":"320","/freemail/3cclient/photo_album/":"103","/freemail/3cclient/ereader/":"737","/freemail/3cclient/office/":"738","/freemail/3cclient/bookmark/":"350","/freemail/3cclient/greeting_cards/":"98","/freemail/3cclient/notes/":"350","/freemail/3cclient/smartdrive/":"105","/freemail/3cclient/ebay/":"51","/freemail/3cclient/calendar/":"350","/freemail/3cclient/csc/":"320","/freemail/smartdrive/photoalbum/":"105","/freemail/smartdrive/storage/":"105","/freemail/3cclient/mioclickapp/":"15","/freemail/help/3c_fm/":"280","/freemail/help/3c_pm/":"280","/freemail/3cclient/greeting_cards_oid/":"98","/freemail/navigator/bookmarks/":"319","/freemail/3cclient/addressbook/":"320","/freemail/3cclient/fax/":"100","/freemail/3cclient/umsapp/":"100","/freemail/3cclient/photo_album_new/":"103","/freemail/3cmail_fm/browser_unsupported/":"280","/freemail/3cmail_pm/browser_unsupported/":"280","/external/album/":"105","/freemail/landingpage/":"97","/freemail/quickhelp/":"280","/freemail/3cmail_pm/":"97","/freemail/3cclient/":"97","/freemail/navigator/":"97","/freemail/comsaddressbook/":"320","/freemail/mediacenter/":"350","/freemail/3cmail_fm/":"97","/interstitial/":"42","/freemail/":"208"};
NSfTIF.keywordMapping={};NSfTIF.sectionListOewa={};NSfTIF._mapPgId2ContentClass=function(a){if(this._isDef(this.sectionList[a])){return this.sectionList[a]
}else{return this._getIdCode()}return""};NSfTIF._validateSection=function(a){a="/"+String(a).toLowerCase()+"/";a=a.replace(/\/\//g,"/");
return a.substr(1,a.length-2)};NSfTIF._setPTypeUid=function(a){if(this._isDef(this.uidPixeltypeList[a])){this.pTypeUid=a}else{this.pTypeUid="XP"
}};NSfTIF._setSection=function(a){this.section=this._validateSection(a)};NSfTIF._getIdCode=function(){var a="/"+this.section+"/";
var b=a.length;for(var c in this.sectionList){if(b>=c.length&&a.substr(0,c.length)==c){this.tax_id=this.sectionList[c];break
}}return this.tax_id};NSfTIF._loadPixel=function(a){if(a){(new Image()).src=a}};NSfTIF._mapPgId2SKTG=function(a){if(this._isDef(this.sectionListOewa[a])){return this.sectionListOewa[a]
}else{return this._getIdCodeOewa()}return""};NSfTIF._getIdCodeOewa=function(){var a="/"+this.section+"/";var b=a.length;for(var c in this.sectionListOewa){if(b>=c.length&&a.substr(0,c.length)==c){this.sktg=this.sectionListOewa[c];
break}}return this.sktg};NSfTIF._replaceVariables=function(a){a=a.replace(/__SC__/g,this.section);a=a.replace(/__TYPE__/g,this.pType);
a=a.replace(/__CODE__/g,this.tax_id);a=a.replace(/__SKTG__/g,this.sktg);a=a.replace(/__CRG__/g,this.cr);a=a.replace(/__CR__/g,this.cr);
a=a.replace(/__CC__/g,this.cc);a=a.replace(/__REGION__/g,this.rc);a=a.replace(/__R__/g,escape(document.referrer));a=a.replace(/__D__/g,this._getRandom());
a=a.replace(/__MAND__/g,this.mandant);a=a.replace(/__UIDPTYPE__/g,this.pTypeUid);a=a.replace(/__CNR__/g,this.cnr);a=a.replace(/__PID__/g,this.pid);
a=a.replace(/__ORIGIN__/g,this.origin);for(var b in this.options){a=a.replace(new RegExp("__"+b.toUpperCase()+"__","g"),this.options[b])
}a=a.replace(/__[A-Z_]+__/g,"");return a};NSfTIF._rvmv=function(a){for(key in a){a[key]=NSfTIF._replaceVariables(a[key])}return a
};NSfTIF._isDef=function(b){return typeof(b)!="undefined"};NSfTIF.init=function(a){if(!this._isDef(a)){return}if(typeof a.frabo=="boolean"){this.frabo=a.frabo
}if(typeof a.has_ads=="boolean"){this.has_ads=a.has_ads}if(a.ptypeuid){this._setPTypeUid(a.ptypeuid)}if(a.cr){this.cr=a.cr
}if(a.cc){this.cc=a.cc.toLowerCase()}if(a.region){this.rc=a.region.toLowerCase()}this.initUniv(a);if(a.pageidentifier){this._setSection(a.pageidentifier);
var b=this._mapPgId2ContentClass(this.section);if(b!=""){this.tax_id=b}b=this._mapPgId2SKTG(this.section);if(b!=""){this.sktg=b
}}if(a.contentclass){this.tax_id=a.contentclass}if(a.sktg){this.sktg=a.sktg}};NSfTIF.initUniv=function(a){if(a){for(var b in a){if(b.match(/^[a-z_]+$/i)){this.options[b]=a[b]
}}}};NSfTIF.checkFraBo=function(){return this.frabo&&window.location.protocol=="http:"&&document.readyState!="complete"};
NSfTIF.rlsTrc=function(a){this._loadPixel(this._replaceVariables(a))};NSfTIF.rlsTrcRed=function(a){window.location=this._replaceVariables(a)
};NSfTIF._trim=function(a){return a.replace(/\s+$/,"").replace(/^\s+/,"")};NSfTIF._getRandom=function(){return Math.round(Math.random()*100000)
};NSfTIF.tifInit=function(a){if(a){this.init(a)}if(typeof NSfTIF.track==="function"){NSfTIF.track()}};NSfTIF.track=function(i){if(i){this.init(i)
}this.sktg="Service/Messaging/Email";this.rlsTrc("//pixelbox.uimserv.net/cgi-bin/gmx/__TYPE__/__CODE__;sc=__SC__/__REGION__&crg=__CRG__&cc=__CC__&brand=gmx&region=__REGION__&dclass=classic&hid=__HID__&ff=__FF__&tif=__CNR__-__PID__-__ORIGIN__?d=__D__&r=__R__");
if(NSfTIF.options.brand==="gmx"&&this.rc==="ch"){var d="//gmx";if("https:"===window.location.protocol){d+="-ssl"}else{d+="ch"
}this.rlsTrc(d+".wemfbox.ch/cgi-bin/ivw/__TYPE__/__CODE__?r=__R__&d=__D__")}if(this.cc.toLowerCase()=="ch"||this.rc.toLowerCase()=="ch"){this.rlsTrc("//pixelbox.uimserv.net/cgi-bin/gmx_ch/__TYPE__/__CODE__;sc=__SC__/__REGION__&crg=__CRG__&cc=__CC__&brand=gmx&region=__REGION__&dclass=classic&ff=__FF__&tif=__CNR__-__PID__-__ORIGIN__?d=__D__&r=__R__")
}if(this.cc.toLowerCase()=="at"||this.rc.toLowerCase()=="at"){this.rlsTrc("//pixelbox.uimserv.net/cgi-bin/gmx_at/__TYPE__/__CODE__;sc=__SC__/__REGION__&crg=__CRG__&cc=__CC__&brand=gmx&region=__REGION__&dclass=classic&ff=__FF__&tif=__CNR__-__PID__-__ORIGIN__?d=__D__&r=__R__")
}if(NSfTIF.options.brand==="gmx"&&NSfTIF.rc==="at"&&NSfTIF.options.deviceclass){NSfTIF.sktg=NSfTIF._trim(NSfTIF.sktg);var e=window.location.hostname;
if(e.match(/gmx.at$/)&&!NSfTIF.sktg.match(/gmx.at$/)){NSfTIF.sktg+="/gmx.at"}else{if(e.match(/gmx.net$/)&&!NSfTIF.sktg.match(/gmx.net$/)){NSfTIF.sktg+="/gmx.net"
}}var b="//";if(window.location.protocol=="https:"){b+="ssl-"}b+="gmx.oewabox.at/cgi-bin/ivw/__TYPE__/__SKTG__";if("mobile"===NSfTIF.options.deviceclass||"app"===NSfTIF.options.deviceclass){b+="/moewa/"
}b+=";?r=__R__&d=__D__";NSfTIF.rlsTrc(b)}if(NSfTIF.options.hid&&NSfTIF.options.hid!==""){NSfTIF.hid2mchash=true}if(window.iom&&this.options.brand&&this.has_ads&&this.cc==="de"&&this.rc==="de"){var g=this.options.deviceclass||"desktop";
var a=this.options.brand;if("auto-service"===a){a="autoser"}var f="";if("mobile"===g||"app"===g){f="mob"}var h="";if("webde"===a&&"desktop"===g){h="ssl"
}var c={};c.st=f+a+h;c.cp=this.tax_id;if(this.frabo&&window.location.protocol==="http:"){c.sv="desktop"===g?"i2":"mo"}else{c.sv="ke"
}if(this.hid2mchash){c.mc=this.options.hid}iom.c(c,2)}};NSfTIF.freereader_click=function(a){if(a){this.init(a)}this.rlsTrc("//uidbox.uimserv.net/cgi-bin/__MAND__/AP/evtid=__EVTID__&haID=__HAID__&agof=__AGOF__&mediaID=__MEDIAID__&mpID=__MPID__&site=__SITE__&region=__REGION__&sc=__UID_SC__&rid=__RID__&item_id=__ITEMID__&tif=__CNR__-__PID__-__ORIGIN__?d=__D__")
};NSfTIF._loadJavaScript=function(b){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",b);
if(document.head){document.head.appendChild(a)}};NSfTIF._writeJS=function(a){document.write('<script type="text/javascript" src="'+a+'"><\/script>')
};if(!window.UIM){window.UIM={}}UIM.uim_init={};UIM.init=function(a){if(a){UIM.uim_init=a}};UIM.Pageview=function(a){NSfTIF.origin="UIM";
if(typeof(a)=="undefined"){NSfTIF.track(UIM.uim_init)}else{if(!a.site&&UIM.uim_init.site){a.site=UIM.uim_init.site}if(!a.pageidentifier&&a.section){a.pageidentifier=a.section
}NSfTIF.track(a)}NSfTIF.origin="NSfTIF"};var TIF={tifInit:function(a){NSfTIF.origin="TIF";NSfTIF.track(a);NSfTIF.origin="NSfTIF"
}};var SMV={smvInit:function(a){NSfTIF.origin="SMV";NSfTIF.track(a);NSfTIF.origin="NSfTIF"}};var szmvars="";var iom=iom||(function(){var f="dummy",d="de.ioam.de/tx.io",h="de.ioam.de/aid.io",H=["","inst","open","clse","play","stop","fowa","bakw","recd","paus","forg","bakg","dele","refr","view","alve","aforg","abakg","aclse"],y=[],I=1,e=0,i=1,t="",u="Leercode_nichtzuordnungsfaehig",m={onfocus:"aforg",onblur:"abakg",onclose:"aclse"},K=0;
var o=null,L=null,p={},g,G=0,c=0,z=0;function b(){if((e==1||p.tb=="on")&&p.tb!="off"&&!G){G=1;g=1;for(var O in m){(function(Q){var P=window[Q];
window[Q]=function(){if(t!=m[Q]){t=m[Q];M(m[Q])}if(typeof P=="function"){P()}}})(O)}}}function x(){if((K&2)?((typeof p.nt=="undefined")?(K&1):p.nt):K&1){if(window.navigator.msDoNotTrack&&window.navigator.msDoNotTrack=="1"){return true
}if(window.navigator.doNotTrack&&(window.navigator.doNotTrack=="yes"||window.navigator.doNotTrack=="1")){return true}}return false
}function k(){szmvars=p.st+"//"+p.pt+"//"+p.cp+"//VIA_SZMNG";if(i&&!c&&p.sv!=="ke"&&(p.sv==="in"||p.sv==="mo"||p.sv==="i2")){c=1;
var R=0;var O=document.cookie.split(";");for(var S=0;S<O.length;S++){if(O[S].match("POPUPCHECK=.*")){var P=new Date();var Q=P.getTime();
P.setTime(O[S].split("=")[1]);if(P.getTime()>=Q){R=1}break}}if(R==0&&p.sv==="in"){document.write("<script src='"+window.location.protocol+"//qs.ioam.de/?"+((window.szmvars)?szmvars:"")+"'><\/script>")
}if(R==0&&p.sv==="i2"){if(L){L.parentNode.removeChild(L)}L=s(window.location.protocol+"//qs.ioam.de/?"+((window.szmvars)?szmvars:""))
}if(R==0&&p.sv==="mo"){if(L){L.parentNode.removeChild(L)}L=s(window.location.protocol+"//mqs.ioam.de/?"+((window.szmvars)?szmvars:""))
}}}function E(P){var Q=0;for(var O=0;O<P.length;++O){Q+=P.charCodeAt(O);Q+=(Q<<10);Q^=(Q>>6)}Q+=(Q<<3);Q^=(Q>>11);Q+=(Q<<15);
Q=Math.abs(Q&Q);return Q.toString(36)}function a(){var O="",R,Q=["7790769C-0471-11D2-AF11-00C04FA35D02","89820200-ECBD-11CF-8B85-00AA005B4340","283807B5-2C60-11D0-A31D-00AA00B92C03","4F216970-C90C-11D1-B5C7-0000F8051515","44BBA848-CC51-11CF-AAFA-00AA00B6015C","9381D8F2-0288-11D0-9501-00AA00B911A5","4F216970-C90C-11D1-B5C7-0000F8051515","5A8D6EE0-3E18-11D0-821E-444553540000","89820200-ECBD-11CF-8B85-00AA005B4383","08B0E5C0-4FCB-11CF-AAA5-00401C608555","45EA75A0-A269-11D1-B5BF-0000F8051515","DE5AED00-A4BF-11D1-9948-00C04F98BBC9","22D6F312-B0F6-11D0-94AB-0080C74C7E95","44BBA842-CC51-11CF-AAFA-00AA00B6015B","3AF36230-A269-11D1-B5BF-0000F8051515","44BBA840-CC51-11CF-AAFA-00AA00B6015C","CC2A9BA0-3BDD-11D0-821E-444553540000","08B0E5C0-4FCB-11CF-AAA5-00401C608500","D27CDB6E-AE6D-11CF-96B8-444553540000","2A202491-F00D-11CF-87CC-0020AFEECF20"];
document.body.addBehavior("#default#clientCaps");for(var P=0;P<Q.length;P++){R=document.body.getComponentVersion("{"+Q[P]+"}","ComponentID");
if(R!=null){O+=R}else{O+="null"}}return O}function j(){var R=window.navigator,P=R.userAgent;P+=D();if(R.plugins.length>0){for(var O=0;
O<R.plugins.length;O++){P+=R.plugins[O].filename+R.plugins[O].version+R.plugins[O].description}}if(R.mimeTypes.length>0){for(var O=0;
O<R.mimeTypes.length;O++){P+=R.mimeTypes[O].type}}if(/MSIE (\d+\.\d+);/.test(R.userAgent)){try{P+=a()}catch(Q){}}return E(P)
}function s(O){var Q=document.createElement("script");Q.type="text/javascript";Q.src=O;var P=document.getElementsByTagName("head")[0];
if(P){P.appendChild(Q);return Q}else{return false}}function B(Q,R){if(Q.split("/")[2].slice(Q.split("/")[2].length-8)==".ioam.de"){switch(R){case 1:if(o){o.parentNode.removeChild(o)
}o=s(Q+"&mo=1");if(!o){(new Image()).src=Q+"&mo=0"}break;case 2:(new Image()).src=Q+"&mo=0";break;case 3:var P=document.getElementById("iamsendbox"),O;
if(P){document.body.removeChild(P)}P=document.createElement("iframe");P.id="iamsendbox";O=P.style;O.position="absolute";O.left=O.top="-999px";
P.src=Q+"&mo=1";document.body.appendChild(P);break;case 0:default:document.write('<script src="'+Q+'&mo=1"><\/script>')}}}function D(){return screen.width+"x"+screen.height+"x"+screen.colorDepth
}function N(O,Q){var P;for(P=0;P<O.length;P++){if(O[P]==Q){return true}}return false}function w(O){if(!O){O=""}O=O.replace(/[?#].*/g,"");
O=O.replace(/[^a-zA-Z0-9,_\/-]+/g,".");if(O.length>255){O=O.substr(0,254)+"+"}return O}function F(){var O=document.referrer.split("/");
return(O.length>=3)?O[2]:""}function r(P){p={};var O;for(O in P){if(P.hasOwnProperty(O)){p[O]=P[O]}}if(p.hasOwnProperty("fp")){p.fp=(p.fp!=""&&typeof p.fp!="undefined")?p.fp:u;
p.fp=w(p.fp);p.pt="FP"}if(p.hasOwnProperty("np")){p.np=(p.np!=""&&typeof p.np!="undefined")?p.np:u;p.np=w(p.np);p.pt="NP"
}if(p.hasOwnProperty("xp")){p.xp=(p.xp!=""&&typeof p.xp!="undefined")?p.xp:u;p.xp=w(p.xp);p.pt="XP"}if(p.hasOwnProperty("cp")){p.cp=(p.cp!=""&&typeof p.cp!="undefined")?p.cp:u;
p.cp=w(p.cp);p.pt="CP"}if(!p.pt){p.cp=u;p.pt="CP";p.er="N13"}p.rf=F();p.r2=document.referrer;p.ur=document.location.host;
p.xy=D();p.cb="8004";p.vr="307";p.id=j();p.st=p.st?p.st:f}function M(R){var P="";var O;R=R||"";if(z&&!x()&&(!I||(I&&N(H,R)))){p.lt=(new Date()).getTime();
p.ev=R;var Q=(window.location.protocol.slice(0,4)==="http")?window.location.protocol:"https:";if(!(N(y,p.st))&&((/iPhone/.test(window.navigator.userAgent)||/iPad/.test(window.navigator.userAgent))&&/Safari/.test(window.navigator.userAgent)&&!(/Chrome/.test(window.navigator.userAgent)))){d=h;
g=3;p.u2=document.URL}for(O in p){if(p.hasOwnProperty(O)&&O!="cs"&&O!="url"){P=P+encodeURIComponent(O).slice(0,8)+"="+encodeURIComponent(p[O]).slice(0,2048)+"&"
}}P=P.slice(0,4096);p.cs=E(P);p.url=Q+"//"+d+"?"+P+"cs="+p.cs;B(p.url,g);return p}return{}}function n(){if(p.oer==="yes"&&!window.IVW&&!document.IVW){var O=(window.location.protocol.slice(0,4)==="http")?window.location.protocol:"https:";
var Q=(p.co)?p.co+"_SENT_VIA_MIGRATION_TAG":"SENT_VIA_MIGRATION_TAG";var P=(p.oc)?p.oc:((p.cp)?((p.cp==u)?"":p.cp):"");var R=(p.pt!==null)?p.pt:"CP";
(new Image()).src=O+"//"+p.st+".ivwbox.de/cgi-bin/ivw/"+R.toUpperCase()+"/"+P+";"+Q+"?r="+escape(document.referrer)+"&d="+(Math.random()*100000)
}}function C(P,O){J(P,O);return M(p.ev)}function J(P,O){g=O;r(P);if(p.sv){p.sv=(p.sv=="in"&&g==1)?"i2":p.sv}b();k();z=1;n();
return{}}function l(S,P){J(S,P);var Q=(typeof localStorage==="object"&&typeof localStorage.getItem==="function")?localStorage.getItem("ioam_smi"):null;
var O=(typeof localStorage==="object"&&typeof localStorage.getItem==="function")?localStorage.getItem("ioam_site"):null;var R=(typeof localStorage==="object"&&typeof localStorage.getItem==="function")?localStorage.getItem("ioam_bo"):null;
if(Q!==null&&O!==null&&R!==null){p.mi=Q;p.fs=p.st;p.st=O;p.bo=R;if(p.fs==p.st){p.cp=(p.cp.slice(0,10)!=="___hyb2___")?"___hyb2___"+p.fs+"___"+p.cp:p.cp
}else{p.cp=(p.cp.slice(0,9)!=="___hyb___")?"___hyb___"+p.fs+"___"+p.cp:p.cp}return M(p.ev)}else{if(Q!==null&&R!==null){return{}
}else{if(window.location.protocol.slice(0,4)!=="http"||/IOAM\/\d+\.\d+/.test(window.navigator.userAgent)){return{}}else{return M(p.ev)
}}}}function v(P){if(localStorage.getItem("ioam_smi")===null||localStorage.getItem("ioam_site")===null||localStorage.getItem("ioam_bo")===null||localStorage.getItem("ioam_smi")!==P){p.fs=p.st;
var O=null;var R=null;if(typeof P==="string"&&typeof JSON==="object"&&typeof JSON.parse==="function"){try{O=JSON.parse(P);
if(O.hasOwnProperty("library")){if(O.library.hasOwnProperty("offerIdentifier")){if(O.library.offerIdentifier){R=O.library.offerIdentifier
}else{p.er="JSON(E10): offerIdentifier not valid"}}else{p.er="JSON(E10): no key offerIdentifier"}}else{p.er="JSON(E10): no key library"
}}catch(Q){p.er="JSON(E10): "+Q}}if(R!==null){localStorage.setItem("ioam_site",R)}p.st=R;p.mi=P;p.bo=(new Date()).getTime();
localStorage.setItem("ioam_smi",p.mi);localStorage.setItem("ioam_bo",p.bo);if(p.fs==p.st){p.cp=(p.cp.slice(0,10)!=="___hyb2___")?"___hyb2___"+p.fs+"___"+p.cp:p.cp
}else{p.cp=(p.cp.slice(0,9)!=="___hyb___")?"___hyb___"+p.fs+"___"+p.cp:p.cp}return M(p.ev)}return{}}if(typeof window.postMessage!="undefined"&&typeof JSON==="object"&&typeof JSON.parse==="function"&&typeof JSON.stringify==="function"){var q;
var A="";if(window.addEventListener){q=window.addEventListener}else{q=window.attachEvent;A="on"}q(A+"message",function(R){try{var O=JSON.parse(R.data)
}catch(P){O={type:false}}if(typeof O=="object"&&O.type=="iam_data"){var Q={seq:O.seq,iam_data:{st:p.st,cp:p.cp}};R.source.postMessage(JSON.stringify(Q),R.origin)
}})}return{count:C,c:C,i:J,init:J,e:M,event:M,h:l,hybrid:l,setMultiIdentifier:v,smi:v}})();