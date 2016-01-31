/*!
 * Please note:
 * This file bridges temporarily generic EIC to IAC Jumps,
 * until the upcoming IAC Version 4.0 is released.
 */
var nx = nx || {};

!(function() {
	
	var invoke, map, whitelist;
	
	whitelist = {
		"open_photo_album_new" : true,
		"open_smartdrive" : true,
		"open_theme_settings" : true,
		"open_ident" : true,
		"settings_mailcollector" : true,
		"open_premium_upselling" : true,
		"open_mioclick_app" : true,
		"open_ocm_oid" : true,
		"open_demail" : true,
		"settings_signature" : true,
		"open_ereader" : true
	};
	
	invoke = {
			
		/**
		 * Triggers an 3.1.0 IAC Call, without Payload.
		 * 
		 * @param  {String} usecase     The Usecase, which should be triggered via the IAC
		 * @param  {mixed} whitelisting Defines, if the call has to be checked for correct whitelisting
		 * @return {void}               Returns nothing
		 */
		iacUsecase : function(usecase, whitelisting) {
			if (whitelisting && !whitelist.hasOwnProperty(usecase)) {
				return;
			}
			
			nx.iac.Client.invokeRPC(usecase, {});
		},

		/**
		 * Opens an application. In case of given payload, the app will be opened via GOTO/Feature.
		 * If there is no payload, the app will be opened due to IAC.
		 * 
		 * @param  {String} usecase      The Usecase, which should be triggered via the IAC, if no payload exists
		 * @param  {String} goto_feature Defines the GOTO/Feature, which must be set in case of given payload
		 * @param  {String} payload      Defines an optional payload.
		 * @return {void}                Returns nothing
		 */
		withPayload : function(usecase, goto_feature, payload) {
			if (typeof payload == 'undefined') {
				nx.iac.Client.invokeRPC(usecase, {});
			} else {
				nx.iac.Client.openGotoFeature({
					goto_feature : goto_feature,
					data : payload
				});
			}
		},

		/**
		 * This function is still supported, but marked ad deprecated.
		 * 
		 * @deprecated              Usecases should be migrated to IAC 3.1.0 or higher.
		 * @return {void}           Returns nothing
		 */
		withIAC_3_0 : function() {
			nx.iac.Client.invokeRPC.apply(nx.iac.Client, arguments);
		},
		
		/**
		 * Opens a generic goto
		 */
		openGoto: function(gotoName, data) {
			nx.iac.Client.openGotoFeature({
				goto_feature: gotoName,
				data: data
			});
		}
		
	};
	
	map = {
			
		"eic_iac" : function(payload) {
			invoke.iacUsecase(payload, true);
		},
		
		"goto" : function(payload) {
			
			var params = (payload || ',').split(',');
			
			invoke.openGoto(params[0], params[1]);
		},
		
		"oms_03950739_speicherplatz_ocs" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/speicherplatz_3c/', 'mc=03950910');
		},
		
		"oms_freemail_produktauswahl" : function() {
			invoke.withIAC_3_0('open_pcsicherheit', 'goto=/online/produktauswahl/', 'mc=freemail@content@toplink_3c.pc-sicherheit@home');
		},
		
		"oms_03950738_club_ocs" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/club_3c/', 'mc=03950911');
		},
		
		"oms_freemail_club_simfy" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/simfy/', 'mc=03950955');
		},
		
		"oms_03950740_speicherplatz_ocs" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/speicherplatz_3c/', 'mc=03950912');
		},
		
		"oms_03950741_emailsize_ocs" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/emailsize_3c/', 'mc=03950913');
		},
		
		"oms_03950742_freephone" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/club_3c/', 'mc=03950742');
		},
		
		"oms_1608201101_club_ocs" : function() {
			invoke.withIAC_3_0('open_digitaledienste', 'goto=/freemail/club/club_3c/', 'mc=03950914');
		},
		
		"oms_freemail_club_produktauswahl" : function() {
			invoke.withIAC_3_0('open_pcsicherheit', 'goto=/online/produktauswahl/', 'mc=freemail@content@toplink_3c.pc-sicherheit@home');
		},
		
		"oms_club_online" : function() {
			invoke.withIAC_3_0('open_maildomain', 'goto=/online/', 'mc=club@toplink@mdh.maildomain@home');
		},
		
		"oms_kwkclub" : function() {
			invoke.withIAC_3_0('open_kwk', '', 'mc=kwkclub@toplink.kwk@home');
		},
		
		"uid_freereader" : function() {
			invoke.iacUsecase('open_ereader');
		},
		
		"uid_limango" : function() {
			invoke.iacUsecase('open_limango');
		},
		
		"uid_limango_oid": function(payload) {
			invoke.withPayload('open_limango_oid', 'uid_limango_oid', payload);
		},
		"uid_revenupath" : function(payload) {
			invoke.withPayload('open_revenupath_oid', 'uid_revenupath', payload);
		},
		"uid_ocm" : function(payload) {
			invoke.withPayload('open_ocm_oid', 'uid_ocm', payload);
		},
		"uid_demail_partner" : function(payload) {
			invoke.withPayload('open_revenupath_demail_oid', 'revenupath_demail_oid', payload);
		},
		"uid_leadbanner" : function(payload) {
			invoke.withPayload('open_revenupath_leadbanner_oid', 'revenupath_leadbanner_oid', payload);
		},
		"osgw7": function() {
			nx.iac.Client.openGotoFeature({
				goto_feature: 'osgw7'
			});
		}
	};
	
	/**
	 * This method mocks "the eic.commands.jumpto" method
	 * 
	 * @example eic.commands.jumpto = nx.eicJumpTo;
	 * @param {String} Defines the given EIC payload
	 * @returns {void} Returns nothing
	 */
	nx.eicJumpTo = function(target) {
		
		target = target.split('|');
		
		if (map.hasOwnProperty(target[0])) {
			map[target[0]](target[1]);
		}
	};
	
}());