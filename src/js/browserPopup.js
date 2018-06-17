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

			methods.getI18nDictionary(function(dict) {
				methods.renderMainLayout(dict);

				InfluencerBg.getUserInfo(function(userData){
					if(userData) {
						methods.renderUserInfo(userData, dict);
					} else {
						methods.renderLoginForm(dict);
					}
				});
			});


		},
		renderMainLayout: function(dict) {
			var template = Handlebars.templates['browserPopupContainer'];

			$(document.body).html(template({
				'i18n': dict
			}));

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
		renderUserInfo: function (userData, dict) {
			var template = Handlebars.templates['userInfoPanel'];

			$('#content').html(template({
				'i18n': dict,
				'name': userData.name || '',
				'email': userData.email || ''
			}));

			$('#user-info-panel .js-logout').on('click', function(e) {
				e.preventDefault();
				InfluencerBg.setItem('token', null);
				methods.renderLoginForm(dict);
			});
		},

		renderLoginForm: function (dict) {
			var template = Handlebars.templates['loginForm'];

			$('#content').html(template({
				'i18n': dict
			}));

			var $form = $('#auth-form');

			$form.submit(function (e) {
				e.preventDefault();
				methods.renderLoader(dict);

				InfluencerBg.getUserToken({
					username: $form.find('[name="login"]').val(),
					password: $form.find('[name="password"]').val()
				}).done(function (userData) {
					if (userData.token) {
						InfluencerBg.setItem('token', userData.token);
						InfluencerBg.getUserInfo(function(userData){
							if(userData) {
								methods.renderUserInfo(userData, dict);
							}
						});
					}
					console.log(userData);
				})
				.fail(function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
				});
			});

			$form.find('.js-register').on('click', function(e) {
				e.preventDefault();
				methods.getBrowser().tabs.create({url: 'https://askfionna.com'});
			})
		},
		renderLoader: function(dict, $parent) {
			$parent = $parent || $('#content');
			var template = Handlebars.templates['loader'];

			$parent.html(template({
				'i18n': dict
			}));
		}
	};

	$(methods.init);

    return {
        init: function() {
            return methods.init();
        }
    }
})(jQuery);