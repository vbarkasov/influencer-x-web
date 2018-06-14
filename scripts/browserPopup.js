VKARpopup = (function($){
    var methods = {
		getBrowser: function () {
			if (typeof(chrome) === 'undefined' && typeof(browser) !== 'undefined') {
				return browser;
			} else return chrome;
		},
		getI18nDictionary: function (callback) {
			var currentLocale = methods.getBrowser().i18n.getUILanguage();
			if (currentLocale.indexOf('-') !== -1) {
				currentLocale = currentLocale.split('-')[0];
			}
			$.getJSON('/_locales/' + currentLocale + '/messages.json', function (data) {
				if (typeof(callback) === 'function') {
					callback(data);
				}

			}).fail(function (jqXHR, textStatus, errorThrown) {
				$.getJSON('/_locales/en/messages.json', function (data) {
					if (typeof(callback) === 'function') {
						callback(data);
					}
				})
			});
		},
		init: function () {
			window.InfluencerBg = methods.getBrowser().extension.getBackgroundPage().InfluencerBg;

			$('#auth-form').submit(function (e) {
				e.preventDefault();
				var $form = $(this);

				InfluencerBg.getUserToken({
					username: $form.find('[name="login"]').val(),
					password: $form.find('[name="password"]').val()
				}).done(function (userData) {
					if (userData.token) {
						InfluencerBg.setItem('token', userData.token);
						methods.showUserInfo(userData);
					}
					console.log(userData);
				})
					.fail(function (jqXHR, textStatus, errorThrown) {
						console.log(textStatus);
					});
			});

			$('.js-open-url').click(function (e) {
				e.preventDefault();
				var url = $(this).attr('href');
				methods.getBrowser().tabs.create({url: url});
			});

			$('.js-close-popup').click(function (e) {
				e.preventDefault();
				window.close();
			});
		},
		showUserInfo: function (userData) {
			$('#content').html(
				'<div class="user-info-item">' + userData.user_display_name + '</div>' +
				'<div class="user-info-item">' + userData.user_email + '</div>'
			)
		}
	};

	$(methods.init);

    return {
        init: function() {
            return methods.init();
        }
    }
})(jQuery);