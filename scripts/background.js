chrome.webNavigation.onCompleted.addListener(function (data) {

	jQuery.get("https://welearn.school/wp-json/v1/?s="+data.url, function(edata) {
		f = edata;
		console.log(f);
		if('name' in f) {
			
			zcode = 'var influencerData=JSON.parse(`'+JSON.stringify(edata)+'`); ';

			$.get("./popup.html", function(pd) {
				chrome.tabs.executeScript(data.tabId,{
					code: zcode+"var div=document.createElement('div'); document.body.appendChild(div); div.innerHTML=`"+pd+"`;"
				});

				$.get("./scripts/pscripts.js", function(zd) {
					chrome.tabs.executeScript(data.tabId,{
						code: zd
					});
					
				});

			});

		}
	});
}
);

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.ib, {
		code: `var fionaBtn = document.getElementById('fiona-btn'); if(fionaBtn){ fionaBtn.click();}`
	});
});