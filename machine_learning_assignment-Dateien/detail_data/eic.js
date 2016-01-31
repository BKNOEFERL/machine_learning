/*!
 * Please note:
 * This file bridges temporarily generic EIC to IAC Jumps,
 * until the upcoming IAC Version 4.0 is released.
 */
var nx=nx||{};!(function(){var a,c,b;b={open_photo_album_new:true,open_smartdrive:true,open_theme_settings:true,open_ident:true,settings_mailcollector:true,open_premium_upselling:true,open_mioclick_app:true,open_ocm_oid:true,open_demail:true,settings_signature:true,open_ereader:true};a={iacUsecase:function(d,e){if(e&&!b.hasOwnProperty(d)){return;}nx.iac.Client.invokeRPC(d,{});},withPayload:function(d,f,e){if(typeof e=="undefined"){nx.iac.Client.invokeRPC(d,{});}else{nx.iac.Client.openGotoFeature({goto_feature:f,data:e});}},withIAC_3_0:function(){nx.iac.Client.invokeRPC.apply(nx.iac.Client,arguments);},openGoto:function(d,e){nx.iac.Client.openGotoFeature({goto_feature:d,data:e});}};c={eic_iac:function(d){a.iacUsecase(d,true);},"goto":function(d){var e=(d||",").split(",");a.openGoto(e[0],e[1]);},oms_03950739_speicherplatz_ocs:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/speicherplatz_3c/","mc=03950910");},oms_freemail_produktauswahl:function(){a.withIAC_3_0("open_pcsicherheit","goto=/online/produktauswahl/","mc=freemail@content@toplink_3c.pc-sicherheit@home");},oms_03950738_club_ocs:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/club_3c/","mc=03950911");},oms_freemail_club_simfy:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/simfy/","mc=03950955");},oms_03950740_speicherplatz_ocs:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/speicherplatz_3c/","mc=03950912");},oms_03950741_emailsize_ocs:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/emailsize_3c/","mc=03950913");},oms_03950742_freephone:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/club_3c/","mc=03950742");},oms_1608201101_club_ocs:function(){a.withIAC_3_0("open_digitaledienste","goto=/freemail/club/club_3c/","mc=03950914");},oms_freemail_club_produktauswahl:function(){a.withIAC_3_0("open_pcsicherheit","goto=/online/produktauswahl/","mc=freemail@content@toplink_3c.pc-sicherheit@home");},oms_club_online:function(){a.withIAC_3_0("open_maildomain","goto=/online/","mc=club@toplink@mdh.maildomain@home");},oms_kwkclub:function(){a.withIAC_3_0("open_kwk","","mc=kwkclub@toplink.kwk@home");},uid_freereader:function(){a.iacUsecase("open_ereader");},uid_limango:function(){a.iacUsecase("open_limango");},uid_limango_oid:function(d){a.withPayload("open_limango_oid","uid_limango_oid",d);},uid_revenupath:function(d){a.withPayload("open_revenupath_oid","uid_revenupath",d);},uid_ocm:function(d){a.withPayload("open_ocm_oid","uid_ocm",d);},uid_demail_partner:function(d){a.withPayload("open_revenupath_demail_oid","revenupath_demail_oid",d);},uid_leadbanner:function(d){a.withPayload("open_revenupath_leadbanner_oid","revenupath_leadbanner_oid",d);},osgw7:function(){nx.iac.Client.openGotoFeature({goto_feature:"osgw7"});}};nx.eicJumpTo=function(d){d=d.split("|");if(c.hasOwnProperty(d[0])){c[d[0]](d[1]);}};}());