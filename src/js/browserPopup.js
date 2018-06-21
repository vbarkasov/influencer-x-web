INLRpopup = (function($) {
	var config = {
		loginFormSelector: 'form#auth-form',
		loginFormStorageKey: 'loginFormValue'
	};

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
				methods.renderLoader(dict);

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

		renderLoginForm: function (dict, callback) {
			var template = Handlebars.templates['loginForm'];
			InfluencerBg.getItem(config.loginFormStorageKey, function(loginFormValue) {
				loginFormValue = loginFormValue || '';
				$('#content').html(template({
					'i18n': dict,
					'loginValue': loginFormValue
				}));

				methods.loginFormBindEvents(dict, $(config.loginFormSelector));
				if(typeof callback === 'function') {
					callback();
				}
			});
		},

		loginFormBindEvents: function(dict, $form) {
			$form.submit(function (e) {
				e.preventDefault();

				var formData = {
					username: $form.find('[name="login"]').val(),
					password: $form.find('[name="password"]').val()
				};

				var formIsValid = methods.validateLoginForm(dict, formData, $form);
				if(!formIsValid) {
					return;
				}

				methods.renderLoader(dict);

				InfluencerBg.getUserToken(formData).done(function (userData) {
					debugger;
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
						methods.renderLoginForm(dict, function(){
							INLRmessage.show(dict.messagesLoginFail.message, 'error', $(config.loginFormSelector));
						});
					});
			});

			$form.find('.js-register').on('click', function(e) {
				e.preventDefault();
				methods.getBrowser().tabs.create({url: 'https://askfionna.com'});
			});

			$form.find('[name="login"]').keyup(function(e) {
				InfluencerBg.setItem(config.loginFormStorageKey, $(this).val());
			});
		},

		validateLoginForm: function(dict, formData, $form) {
			var isValid = true;
			if(!formData.username) {
				INLRmessage.show(dict.loginFormEmptyUsername.message, 'error', $form);
				isValid = false;
			}

			if(!formData.password) {
				INLRmessage.show(dict.loginFormEmptyPassword.message, 'error', $form);
				isValid = false;
			}
			return isValid;
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

INLRmessage = (function($){
	var config = {
		messageClassPrefix: 'inflr-msg__',
		messageContainerTemplate: '<div class="js-inflr-msg-container inflr-msg-container"></div>',
		messageTemplate: '<div class="js-inflr-msg inflr-msg %class%"></div>',
		messageHideTimeout: 4000
	};

	var methods = {
		showMessage: function(text, type, $parent) {
			$parent = $parent || $(document.body);
			var $msgContainer = $parent.find('.js-inflr-msg-container');
			if($msgContainer.length < 1) {
				$msgContainer = $(config.messageContainerTemplate).appendTo($parent);
			}

			var msgTmpl = config.messageTemplate.replace('%class%', methods.getMessageTypeClass(type));
			var $msg = $(msgTmpl).html(text).prependTo($msgContainer);
			window.setTimeout(function() {
				$msg.hide('700', function(){
					$msg.remove();
				})
			}, config.messageHideTimeout);
		},
		getMessageTypeClass: function(msgType){
			var msgTypeClass;
			switch(msgType) {
				case 'error':
					msgTypeClass = 'error';
					break;
				case 'success':
					msgTypeClass = 'success';
					break;
				default:
					msgTypeClass = 'text';
					break;
			}

			return config.messageClassPrefix + msgTypeClass;
		}
	};

	return {
		show: function(text, type, $parent) {
			return methods.showMessage(text, type, $parent);
		}
	}
})(jQuery);