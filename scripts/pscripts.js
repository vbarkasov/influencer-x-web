function appendJquery () {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('scripts/jquery.min.js');
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        this.remove();
    };
}

appendJquery();

setTimeout(function() {

    if(window.influencerInitiated !== true) {


        insertingDataIntoPopup(influencerData.avatar, influencerData.name, influencerData.website, influencerData.rating, influencerData.entities, influencerData.socials, influencerData.course);

        window.influencerInitiated = true;
        loadUpUiElements();
    }
}, 1000);

function loadUpUiElements () {

    var actualCode = '(' + function() {

        var domPopup = document.getElementById('influencer-app')
            domFiona = document.getElementById('fiona-btn')
            domCourseInfo = document.getElementById('course-preview')
            domInfluencerBtn = document.getElementById('last-course-btn')
            domCourseBackBtn = document.getElementById('hide-course-preview-button')
            domSocial = document.getElementById('influencer-social')

        $(document).on("click", ".fiona-btn", function () {
            window.openInfluencerXPopup();
        }).on("click", "#influencer-app .close-btn", function () {
            window.closeInfluencerXPopup();
        }).on("click", "#influencer-app .influencer-x-btn", function () {
            window.openCourseInfo();
        }).on("click", "#hide-course-preview-button", function () {
            window.closeCourseInfo();
        });

        function closeInfluencerXPopup(){
            domPopup.classList.remove('active-popup');
            domFiona.classList.add('active-fiona');
            setTimeout(function(){
                domPopup.classList.add('hide-popup');
            }, 700);
        }

        function openInfluencerXPopup(){
            domPopup.classList.remove('hide-popup');
            domFiona.classList.remove('active-fiona');
            setTimeout(function(){
                domPopup.classList.add('active-popup');
            }, 20);
        }

        function openCourseInfo(){
            domInfluencerBtn.classList.add('course-btn-hidden');
            domSocial.classList.add('influencer-social-hidden')
            domSocial.classList.remove('influencer-social-margin')
            domCourseInfo.classList.remove('course-preview-hidden');
            domCourseInfo.classList.add('course-preview-active');
        }

        function closeCourseInfo(){
            domInfluencerBtn.classList.remove('course-btn-hidden');
            domSocial.classList.remove('influencer-social-hidden')
            domSocial.classList.add('influencer-social-margin')
            domCourseInfo.classList.add('course-preview-hidden');
            domCourseInfo.classList.remove('course-preview-active');
        }

        window.openInfluencerXPopup = openInfluencerXPopup;
        window.closeInfluencerXPopup = closeInfluencerXPopup;
        window.openCourseInfo = openCourseInfo;
        window.closeCourseInfo = closeCourseInfo;

        domPopup.addEventListener( 'click', function( e ) {
            if ( e.target === domPopup ) {
                closeInfluencerXPopup();
            }
        });

        setTimeout(function(){
            domFiona.classList.add('active-fiona');
        }, 20);

    } + ')();';
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
}

function insertingDataIntoPopup(avatar, name, website, rating, social, soc2, course){
    var domAva = $('#influencer-app .influencer-info .avatar'),
      domName = jQuery('#influencer-app .influencer-info .name'),
      domSitelink = jQuery('#influencer-app .influencer-info .website'),
      domRating = jQuery('#influencer-app .course-preview .course-rating'),
      domCourse = jQuery('#influencer-app .influencer-info .last-course-btn'),
      domYoutube = jQuery('#influencer-app #youtube-frame'),
      domCourseCaption = jQuery("#influencer-app .course-caption");
      domCourseRatingNumber = jQuery("#influencer-app .course-rating-number");
      domCourseRatingText = jQuery("#influencer-app .course-rating-text");
      domCoursePrice = jQuery("#influencer-app .course-price");
    
    if(rating == ''){ 
        rating = defaultRating
    }

    domAva.css('background-image', 'url(' + avatar + ')');
    domName.text(name);
    domSitelink.text(website);
    domSitelink.attr('href', website);
    domRating.addClass('rating-' + rating);
    domYoutube.attr('src', 'https://www.youtube.com/embed/PTUkTjC77fA')
    domCourse.children().attr('href', course[0].link);
    domCourseCaption.text('These two programs help people who want to make money and beginner affiliate marketers to get started online. While Super Affiliate System is an upsell of Internet Jetset, it is a completely different training course.')
    domCourseRatingNumber.text(rating/10)
    domCourseRatingText.text('(2,050)')
    domCoursePrice.text('$14.99')



    social.forEach(function(item, i, arr) {
      appendToHTMLSocialItem(item, soc2[i].link);
    });
}

function conversionNumber(num){
	if(num < 1000){
		return num;
	}else if(num >= 1000 && num < 100000){
		return (num/1000).toFixed(1) + 'K';
	}else if(num >= 100000 && num < 1000000){
		return (num/1000).toFixed(0) + 'K';
	}else if(num >= 1000000){
		return (num/1000000).toFixed(1) + 'M';
	}
}

function appendToHTMLSocialItem(arr, lnk){
    var social_names = ["", "facebook", "linkedin", "youtube", "instagram"];
    var sname = social_names[arr.social_id];
    var domSocial = jQuery('#influencer-app .influencer-info .influencer-social');
    var template =  '<div class="influencer-social-item ' + sname + '">' +
            '<a href="' + lnk + '" target="_blank">' +
              '<div class="logo">' +
                '<div class="colored"></div>' +
              '</div>' +
              '<div class="influencer-social-info">' +
                '<p class="number">' + conversionNumber(arr.value) + '</p>' +
                '<p class="number-of">' + arr.entity + '</p>' +
              '</div>' +
            '</a>' +
          '</div>';
  domSocial.append(template);
}