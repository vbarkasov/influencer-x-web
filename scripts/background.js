InfluencerBg = (function($){
	var methods = {
		getBrowser: function () {
			if (typeof(chrome) === 'undefined' && typeof(browser) !== 'undefined') {
				return browser;
			} else return chrome;
		},
		init: function() {
			methods.getBrowser().runtime.onMessage.addListener(
				function (request, sender, sendResponse) {
					console.log('Action: ' + request.action);
					switch (request.action) {
						case 'checkUrl':
							methods.checkUrl(sender.url, sender.tab.id);
							break;
					}
				}
			);

			methods.getBrowser().browserAction.onClicked.addListener(function (tab) {
				chrome.tabs.executeScript(tab.id, {
					code: "var fionaBtn = document.getElementById('fiona-btn'); if(fionaBtn){ fionaBtn.click();}"
				});
			});

			/*chrome.webNavigation.onCompleted.addListener(function (data) {
				methods.checkUrl(data.url, data.tabId);
				}
			);

			chrome.tabs.onUpdated.addListener(
				function(tabId, changeInfo, tab) {
					methods.checkUrl(tab.url, tab.id);
				}
			);*/

		},
		checkUrl: function (url, tabId) {
			$.get("https://welearn.school/wp-json/v1/?s=" + url, function(edata) {
				debugger;
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
				}
			});
		}
	};

	methods.init();
})(jQuery);

