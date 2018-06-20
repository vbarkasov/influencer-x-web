InfluencerBg = (function($){
	var settings = {
		wpApiRoot: 'https://askfionna.com/wp-json'
	};

	var methods = {
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

		getItems: function (keys, callback) {
			var promises = $.map(keys, function (itemKey) {
				var dfd = new $.Deferred();
				methods.log('itemKey:');
				methods.log(itemKey);
				methods.getItem(itemKey, function (itemData) {
					dfd.resolve(itemData);
				});
				return dfd.promise();
			});

			$.when.apply(this, promises)
				.done(function () {
					if (typeof(callback) === 'function') {
						callback.apply(callback, arguments);
					}
				});
		},

		setItem: function(key, value, callback) {
			var data = {};
			data[key] = value;
			methods.getBrowser().storage.local.set(data, function() {
				if(typeof(callback) === 'function') {
					callback();
				}
			});
		},
		init: function() {
			methods.getBrowser().runtime.onMessage.addListener(
				function (request, sender, sendResponse) {
					switch (request.action) {
						case 'checkUrl':
							var url = request.url ? request.url : sender.url;
							methods.checkUrl(encodeURIComponent(url), sender.tab.id);
							break;
						case 'sendStats':
							if(InfluencerBg.ga
								&& InfluencerBg.ga.hasOwnProperty('sendEvent')
								&& request.statsData) {
								InfluencerBg.ga.sendEvent(request.statsData)
							}
							break;
					}
				}
			);

			methods.getBrowser().browserAction.onClicked.addListener(function (tab) {
				methods.getBrowser().tabs.sendMessage(tab.id, {
					action: 'clickFiona'
				});
			});
		},
		checkUrl: function (url, tabId) {
			$.get("https://welearn.school/wp-json/v1/?s=" + url, function(edata) {
				if('name' in edata) {
					$.get("./popup.html", function (popupHtml) {
						methods.getBrowser().tabs.sendMessage(tabId, {
							action: 'showPopup',
							data: {
								popupHtml: popupHtml,
								influencerData: edata
							}
						});
					});
				} else {
					methods.getBrowser().tabs.sendMessage(tabId, {
						action: 'removePopup'
					});
				}
			});
		},
		getUserToken: function(userData) {
			return $.post(settings.wpApiRoot + '/jwt-auth/v1/token', userData, 'json');
		},
		getUserInfo: function(callback) {
			methods.getItem('token', function (token) {
				if(token && typeof token !== 'undefined') {
					$.ajax({
						url: settings.wpApiRoot + '/wp/v2/users/me',
						type: 'POST',
						beforeSend: function (xhr) {
							xhr.setRequestHeader('Authorization', 'Bearer ' + token);
						},
						dataType: 'json'
					})
					.done(function(data){
						callback(data);
					}).fail(function() {
						callback(null);
					});
				} else {
					callback(null);
				}
			});
		},
		validateUserToken: function(token, callback) {
			$.ajax({
				url: settings.wpApiRoot + '/jwt-auth/v1/token/validate',
				type: 'POST',
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer ' + token);
				},
				dataType: 'json'
			})
				.done(function(data){
					callback(data);
				}).fail(function() {
				callback(null);
			});
		}
	};

	methods.init();

	return {
		getItem: methods.getItem,
		getItems: methods.getItems,
		setItem: methods.setItem,
		getUserToken: function(userData) {
			return methods.getUserToken(userData);
		},
		getUserInfo: methods.getUserInfo
	}
})(jQuery);