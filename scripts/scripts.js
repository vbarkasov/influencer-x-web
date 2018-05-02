$(document).ready(function() {
	var domPopup = $('#app');
	function closeInfluencerXPopup(){
		domPopup.removeClass('active-popup');
		setTimeout(function(){
			domPopup.addClass('hide-popup');
		}, 700);
	}
	function openInfluencerXPopup(){
		domPopup.removeClass('hide-popup');
		setTimeout(function(){
			domPopup.addClass('active-popup');
		}, 20);
	}
	$('#app .close-btn').click(function(){
		closeInfluencerXPopup();
	});

	//Working with data/json
	function parseJSON(json){
		return JSON.parse(json);
	}

	function insertingDataIntoPopup(avatar, name, website, rating, social, course){
		var domAva = $('#app .influencer-info .avatar'),
			domName = $('#app .influencer-info .name'),
			domSitelink = $('#app .influencer-info .website'),
			domRating = $('#app .influencer-info .rating'),
			domCourse = $('#app .influencer-info .last-course-btn');

		var defaultPhoto = 'assets/images/default-ava.svg',
			defaultRating = '0';

		if(avatar == ''){
			avatar = 'assets/icons/default-ava.svg';
		}
		if(rating == ''){
			rating = defaultRating;
		}

		domAva.css('background-image', 'url(' + avatar + ')');
		domName.text(name);
		domSitelink.text(website);
		domSitelink.attr('href', website);
		domRating.addClass('rating-' + rating);
		domCourse.children().attr('href', course);

		social.forEach(function(item, i, arr) {
			appendToHTMLSocialItem(item);
		});
	}

	function appendToHTMLSocialItem(arr){
		var domSocial = $('#app .influencer-info .social');
		var template =  '<div class="social-item ' + arr.name + '">' +
							'<a href="' + arr.link + '" target="_blank">' +
								'<div class="logo">' +
									'<div class="grey"></div>' +
									'<div class="colored"></div>' +
								'</div>' +
								'<div class="social-info">' +
									'<p class="number">' + arr.value + '</p>' +
									'<p class="number-of">' + arr.entity + '</p>' +
								'</div>' +
							'</a>' +
						'</div>';
		domSocial.append(template);
	}

	function initInfluencerX(){
		//Load JSON
		//var json = $.getJSON({'url': '../test.json', 'async': false});
		//var json = '{"name": "Artur S","avatar": "assets/images/ava4.jpg","website": "https://mysite.com","rating": 35,"social": [{"name": "linkedin","value": "25,444","entity": "followers","link": "https://linkedin.com"},{"name": "youtube","value": "2,1M","entity": "followers","link": "https://youtube.com"},{"name": "instagram","value": "95,444","entity": "followers","link": "https://instagram.com"}],"course": "https://mycourse.com"}';

		//Parse JSON to JS object
		//var data = parseJSON(json);

		chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

			var activeTab = arrayOfTabs[0];
			var activeTabId = activeTab.id;

			current_url = activeTab.url;

			jQuery.get("http://boldsecurity.com:8888/apitest.php?link="+current_url, function(edata) {
	        	try {
	        		data = JSON.parse(edata);

		        	if('name' in data) {
		        		console.log(1);
						//Inserting data to popup HTML
						insertingDataIntoPopup(data.avatar, data.name, data.website, data.rating, data.social, data.course);

						//Open popup
						openInfluencerXPopup();
		        	} else {
		        		//no
		        	}
	        	} catch {
	    			//no2
	        	}
	        });

			

		});
		
	}

	//Point of entry
	initInfluencerX();
});