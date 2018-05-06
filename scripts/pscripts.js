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

        var domPopup = document.getElementById('influencer-app'),
            domFiona = document.getElementById('fiona-btn');

        $(document).on("click", ".fiona-btn", function () {
            window.openInfluencerXPopup();
        }).on("click", "#influencer-app .close-btn", function () {
            window.closeInfluencerXPopup();
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

        window.openInfluencerXPopup = openInfluencerXPopup;
        window.closeInfluencerXPopup = closeInfluencerXPopup;

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
      domCourse = jQuery('#influencer-app .influencer-info .last-course-btn');

    domAva.css('background-image', 'url(' + avatar + ')');
    domName.text(name);
    domSitelink.text(website);
    domSitelink.attr('href', website);
    domCourse.children().attr('href', course[0].link);

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