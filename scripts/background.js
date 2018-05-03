function listenerHandler(url, tabId) {
	if(!url.includes("://")) return false;
	jQuery.get("https://welearn.school/wp-json/v1/?s="+url, function(edata) {
		f = edata;
		console.log(f);
		if('name' in f) {
			
			zcode = 'var influencerData=JSON.parse(`'+JSON.stringify(edata)+'`); ';

			$.get("./popup.html", function(pd) {
				chrome.tabs.executeScript(tabId,{
					code: zcode+"var div=document.createElement('div'); document.body.appendChild(div); div.innerHTML=`"+pd+"`;"
				});

				$.get("./scripts/pscripts.js", function(zd) {
					chrome.tabs.executeScript(tabId,{
						code: zd
					});
					
				});

			});

		} else {
			chrome.tabs.executeScript(tabId, {

				code: ``//`document.getElementById('influencer-app').style.display = 'none';document.getElementById('fiona-btn').style.display = 'none';`

			});
		}
	});
}

chrome.webNavigation.onCompleted.addListener(function (data) {

	listenerHandler(data.url, data.tabId);
}
);

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    listenerHandler(tab.url, tab.id);
  }
);

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.ib, {
		code: `var fionaBtn = document.getElementById('fiona-btn'); if(fionaBtn){ fionaBtn.click();}`
	});
});