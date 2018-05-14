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
					switch (request.action) {
						case 'checkUrl':
							var url = request.url ? request.url : sender.url;
							methods.checkUrl(encodeURIComponent(url), sender.tab.id);
							break;
					}
				}
			);

			methods.getBrowser().browserAction.onClicked.addListener(function (tab) {
				chrome.tabs.executeScript(tab.id, {
					code: "var fionaBtn = document.getElementById('fiona-btn'); if(fionaBtn){ fionaBtn.click();}"
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
		}
	};

	methods.init();
})(jQuery);

