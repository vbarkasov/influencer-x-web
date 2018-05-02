chrome.webNavigation.onCompleted.addListener(function (data) {
        /*if (data.url && data.url.match(/www\.google\.com/)) {
			window.open("popup.html", "extension_popup", "width=300,height=400");
        }*/
        //console.log(data);
        jQuery.get("http://boldsecurity.com:8888/apitest.php?link="+data.url, function(edata) {
        	try {
        		f = JSON.parse(edata);

	        	if('name' in f) {

	        		
	        		zcode = 'var influencerData=JSON.parse(`'+edata+'`); ';

			    	$.get("./popup.html", function(pd) {
						chrome.tabs.executeScript(data.tabId,{
					        code: zcode+"document.body.innerHTML += `"+pd+"`;"
				    	});

						$.get("./scripts/pscripts.js", function(zd) {
							chrome.tabs.executeScript(data.tabId,{
						        code: zd
					    	});
					    	
				    	});

			    	});

	        	}/* else {
	        		chrome.browserAction.setIcon({
			            path: "icons/icon-16.png",
			            tabId: data.tabId
			        });
	        	}*/
        	} catch {
        		//
        	}
        });
    },
    {
        //url: [{hostContains: '.'}]
    }
);
