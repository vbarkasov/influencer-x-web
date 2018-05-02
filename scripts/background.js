chrome.webNavigation.onCompleted.addListener(function (data) {
        /*if (data.url && data.url.match(/www\.google\.com/)) {
			window.open("popup.html", "extension_popup", "width=300,height=400");
        }*/
        //console.log(data);
        jQuery.get("https://welearn.school/wp-json/v1/?s="+data.url, function(edata) {
        	//try {

        		f = edata; //JSON.parse(edata);
				console.log(f);
	        	if('name' in f) {
        			console.log(11114);
	        		
	        		zcode = 'var influencerData=JSON.parse(`'+JSON.stringify(edata)+'`); ';


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
        	/*} catch {
        		console.log(4222);
        	}*/
        });
    },
    {
        //url: [{hostContains: '.'}]
    }
);
