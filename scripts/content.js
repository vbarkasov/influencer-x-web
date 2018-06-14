window.Influencer = (function($){
	var vars = {
		url: ''
	};

	var methods = {
		getBrowser: function () {
			if (typeof(chrome) === 'undefined' && typeof(browser) !== 'undefined') {
				return browser;
			} else return chrome;
		},
		init: function() {
			methods.getBrowser().runtime.sendMessage({action: 'checkUrl'}, function(response) {});

			methods.getBrowser().runtime.onMessage.addListener(function (request, sender) {
				switch(request.action) {
					case 'showPopup':
						var influencerData = request.data.influencerData;
						methods.removeAllElementsOfExtension();
						$(document.body).append(request.data.popupHtml);
						methods.insertingDataIntoPopup(influencerData);
						methods.initBehavior();
						methods.getBrowser().runtime.sendMessage({
							action: 'sendStats',
							statsData: {
								category: 'popup',
								action: 'show',
								label: 'page',
								value: encodeURIComponent(window.location.href)
							}
						}, function(r) {});
						break;
					case 'removePopup':
						methods.removeAllElementsOfExtension();
						break;
					case 'clickFiona':
						$('#fiona-btn').click();
						break;
				}
			});

			vars.url = window.location.href;

			window.setInterval(function () {
				if (window.location.href !== vars.url) {
					vars.url = window.location.href;
					methods.getBrowser().runtime.sendMessage({
						action: 'checkUrl',
						url: vars.url
					}, function(response) {});
				}
			}, 500);
		},

		removeAllElementsOfExtension: function(){
			$('#influencer-bg-area,#fiona-btn,#influencer-app').remove();
		},

		insertingDataIntoPopup: function(influencerData){
			// init data
			var defaultAvatar = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTMgNTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzIDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQ0VEOyIgZD0iTTE4LjYxMyw0MS41NTJsLTcuOTA3LDQuMzEzYy0wLjQ2NCwwLjI1My0wLjg4MSwwLjU2NC0xLjI2OSwwLjkwM0MxNC4wNDcsNTAuNjU1LDE5Ljk5OCw1MywyNi41LDUzDQoJYzYuNDU0LDAsMTIuMzY3LTIuMzEsMTYuOTY0LTYuMTQ0Yy0wLjQyNC0wLjM1OC0wLjg4NC0wLjY4LTEuMzk0LTAuOTM0bC04LjQ2Ny00LjIzM2MtMS4wOTQtMC41NDctMS43ODUtMS42NjUtMS43ODUtMi44ODh2LTMuMzIyDQoJYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2DQoJYzAtMC43OC0wLjM0Ny0xLjQ3Ny0wLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLDEuMDUzLTcuOTc3LTkuNzUtNy45NzdzLTkuNzUsNy45NzctOS43NSw3Ljk3N3Y1LjEyNg0KCWMtMC41NCwwLjQ4OC0wLjg4NiwxLjE4NS0wLjg4NiwxLjk2NXYzLjU0NmMwLDAuOTM0LDAuNDkxLDEuNzU2LDEuMjI2LDIuMjMxYzAuODg2LDMuODU3LDMuMjA2LDYuNjMzLDMuMjA2LDYuNjMzdjMuMjQNCglDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNMjYuOTUzLDAuMDA0QzEyLjMyLTAuMjQ2LDAuMjU0LDExLjQxNCwwLjAwNCwyNi4wNDdDLTAuMTM4LDM0LjM0NCwzLjU2LDQxLjgwMSw5LjQ0OCw0Ni43Ng0KCQljMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzDQoJCWMtMC43MzQtMC40NzUtMS4yMjYtMS4yOTYtMS4yMjYtMi4yMzF2LTMuNTQ2YzAtMC43OCwwLjM0Ny0xLjQ3NywwLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLTEuMDUzLTcuOTc3LDkuNzUtNy45NzcNCgkJczkuNzUsNy45NzcsOS43NSw3Ljk3N3Y1LjEyNmMwLjU0LDAuNDg4LDAuODg2LDEuMTg1LDAuODg2LDEuOTY1djMuNTQ2YzAsMS4xOTItMC44LDIuMTk1LTEuODg2LDIuNTMNCgkJYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMNCgkJYzAuNTA4LDAuMjU0LDAuOTY3LDAuNTc1LDEuMzksMC45MzJjNS43MS00Ljc2Miw5LjM5OS0xMS44ODIsOS41MzYtMTkuOUM1My4yNDYsMTIuMzIsNDEuNTg3LDAuMjU0LDI2Ljk1MywwLjAwNHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
				rating = influencerData.rating || '0',
				mainIndicator = 84, //main entry point for the Main Indicator value
				avatar = influencerData.avatar || defaultAvatar,
				name = influencerData.name || '',
				website = influencerData.website || '',
				social = influencerData.entities || [],
				soc2 = influencerData.socials || [],
				course = influencerData.course || [];

			console.log(influencerData);

			// set dom elements
			var $popup = $('#influencer-app');
			var $popupInfo = $popup.find('.influencer-info');
			var $avatar = $popupInfo.find('.avatar .photo');
			var $name = $popupInfo.find('.name');
			var $sitelink = $popupInfo.find('.website');
			var $rating = $popup.find('.course-preview .course-rating');
			var $course = $popupInfo.find('.last-course-btn');
			var $youtube = $popup.find('#youtube-frame');
			var $courseCaption = $popup.find('.course-caption');
			var $courseRatingNumber = $popup.find('.course-rating-number');
			var $courseRatingText = $popup.find('.course-rating-text');
			var $coursePrice = $popup.find('.course-price');
			var $mainIndicatorText = $popup.find('.percent');
			var $mainIndicatorCircle = $popupInfo.find('.avatar .main-indecator svg circle');

			// fill data
			$name.text(name);
			$avatar.css('background-image', 'url(' + avatar + ')');
			$rating.addClass('rating-' + rating);
			$sitelink.text(website).attr('href', website);
			if(Array.isArray(course) && course.length > 0 && course[0].hasOwnProperty('link')) {
				$course.children().attr('href', course[0]['link']);
			} else {
				$course.hide();
			}

			$youtube.attr('src', 'https://www.youtube.com/embed/PTUkTjC77fA');
			$courseCaption.text('These two programs help people who want to make money and beginner affiliate marketers to get started online. While Super Affiliate System is an upsell of Internet Jetset, it is a completely different training course.');
			$courseRatingNumber.text(rating/10);
			$courseRatingText.text('(2,050)');
			$coursePrice.text('$14.99');
			$mainIndicatorText.text(mainIndicator + '%');
			$mainIndicatorCircle.css('stroke-dashoffset', 430 - mainIndicator * 4.3);

			if(Array.isArray(soc2) && soc2.length > 0) {
				soc2.forEach(function(item, i, arr) {
					if(soc2[i].hasOwnProperty('link')) {
						methods.appendToHTMLSocialItem(item, soc2[i]['link']);
					}
				});
			}
		},

		initBehavior: function(){
			var $popup = $('#influencer-app');

			$('#fiona-btn').on('click', function(){
				methods.openInfluencerXPopup();
			}).addClass('active-fiona');

			$popup.find('#hide-course-preview-button').on('click', function (e) {
				e.stopPropagation();
				methods.closeCourseInfo();
			});

			$popup.find('.close-btn').on('click', function (e) {
				e.stopPropagation();
				methods.closeInfluencerXPopup();
			});

			$popup.find('.influencer-x-btn').on('click', function (e) {
				e.stopPropagation();
				methods.openCourseInfo();
			});

			$('#influencer-bg-area').on('click', function(){
				methods.closeInfluencerXPopup();
				$(this).hide();
			});
		},
		appendToHTMLSocialItem(arr, lnk) {

			//var socialNames = ['', 'facebook', 'linkedin', 'youtube', 'instagram'];
			var sname = arr.name;
			var $social = $('#influencer-app .influencer-info .influencer-social');

			var ennum = "";
			var ennumof = "";

			if('entities' in arr) {
				console.log('-');
				console.log(arr.entities);
				console.log('-');
				ennum = arr.entities[0].value,
				ennumof = arr.entities[0].entity
			}

			var template =  '' +
				'<div class="influencer-social-item ' + sname + '">' +
					'<a href="' + lnk + '" target="_blank">' +
						'<span class="logo">' +
							'<span class="colored"></span>' +
						'</span>' +
						'<span class="influencer-social-info">' +
							'<span class="number">' + ennum + '</span>' +
							'<span class="number-of">' + ennumof + '</span>' +
						'</span>' +
					'</a>' +
				'</div>';
			$social.append(template);
		},

		closeInfluencerXPopup: function() {
			var $popup = $('#influencer-app');
			$popup.remove('active-popup');
			$('#fiona-btn').addClass('active-fiona');
			$popup.addClass('hide-popup');
		},

		openInfluencerXPopup: function(){
			$('#influencer-app').removeClass('hide-popup').addClass('active-popup');
			$('#fiona-btn').removeClass('active-fiona');
			$('#influencer-bg-area').show();
			methods.getBrowser().runtime.sendMessage({
				action: 'sendStats',
				statsData: {
					category: 'popup',
					action: 'open',
					label: 'page',
					value: encodeURIComponent(window.location.href)
				}
			}, function(r) {});
		},

		openCourseInfo: function(){
			$('#last-course-btn').addClass('course-btn-hidden');
			$('#influencer-social').addClass('influencer-social-hidden')
				.removeClass('influencer-social-margin');
			$('#course-preview').add('course-preview-active')
				.removeClass('course-preview-hidden');
			methods.getBrowser().runtime.sendMessage({
				action: 'sendStats',
				statsData: {
					category: 'popup',
					action: 'clickPreviewCourse',
					label: 'page',
					value: encodeURIComponent(window.location.href)
				}
			}, function(r) {});
		},

		closeCourseInfo: function() {
			$('#last-course-btn').removeClass('course-btn-hidden');
			$('#influencer-social').add('influencer-social-margin')
				.removeClass('influencer-social-hidden');
			$('#course-preview').addClass('course-preview-hidden')
				.removeClass('course-preview-active');
		},

		convertNumberIntoAbbr(num){
			if(num < 1000) {
				return num;
			} else if(num >= 1000 && num < 100000){
				return (num/1000).toFixed(1) + 'K';
			} else if(num >= 100000 && num < 1000000){
				return (num/1000).toFixed(0) + 'K';
			} else if(num >= 1000000){
				return (num/1000000).toFixed(1) + 'M';
			}
		}
	};

	methods.init();

	return {
		courseInfo: {
			open: methods.openCourseInfo,
			close: methods.closeCourseInfo
		},
		popup: {
			open: methods.openInfluencerXPopup,
			close: methods.closeInfluencerXPopup
		}
	};
})(jQuery);