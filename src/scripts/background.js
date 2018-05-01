chrome.webNavigation.onCompleted.addListener(function (data) {
        if (data.url && data.url.match(/www\.google\.com/)) {
			window.open("popup.html", "extension_popup", "width=300,height=400");
        }
    },
    {
        url: [{hostContains: '.google.'}]
    }
);