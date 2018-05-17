// Google Analytics Module
InfluencerBg.ga = (function($) {
	var settings = {
		TRACKING_ID: 'UA-82444817-4',
		clientID: null,
		debug: false
	};

	var methods = {
		log: function(message){
			if(settings.debug && typeof(console) !== 'undefined' && console.log) {
				console.log(message);
			}
		},
		getBrowser: function () {
			if (typeof(chrome) === 'undefined' && typeof(browser) !== 'undefined') {
				return browser;
			} else return chrome;
		},
		getItem: function(key, callback){
			methods.getBrowser().storage.local.get(key, function(val) {
				if(typeof(callback) === 'function') {
					if(!val || typeof(val) === 'undefined') {
						callback(val);
					} else {
						callback(val[key]);
					}

				}
			});
		},
		setItem: function (key, value, callback) {
			var data = {};
			data[key] = value;
			methods.getBrowser().storage.local.set(data, function () {
				if (typeof(callback) === 'function') {
					callback();
				}
			});
		},
		sendEvent: function(statsData) {
			statsData = $.extend(true, {
				category: '',
				action: '',
				label: '',
				value: ''
			}, statsData);

			methods.log('Stats data:');
			methods.log(statsData);

			try {
				var request = new XMLHttpRequest();
				var message = '' +
					'v=1&' +
					't=event&' +
					'tid=' + settings.TRACKING_ID + '&' +
					'cid=' + settings.clientID + '&' +
					'ec=' + statsData.category + '&' +
					'ea=' + statsData.action + '&' +
					'el=' + statsData.label + '&' +
					'ev=' + statsData.value;

				request.open('POST', 'https://www.google-analytics.com/collect', true);
				request.send(message);
			} catch (e) {
				methods.log("ERROR! Error sending report to Google Analytics.\n" + e);
			}
		},
		getUniqueId: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			}).toUpperCase();
		},
		init: function() {
			methods.getItem('clientID', function(clientID) {
				if(typeof(clientID) === 'undefined' || !clientID) {
					methods.log('clientID is absent. Generating clientID...');
					clientID = methods.getUniqueId();
					methods.log('Client UUID: ' + clientID);
					methods.setItem('clientID', clientID);
				}
				settings.clientID = clientID;
			});
		}
	};

	methods.init();

	return {
		settings: settings,
		sendEvent: methods.sendEvent
	}

})(jQuery);

