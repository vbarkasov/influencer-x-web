(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['browserPopupContainer'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"wrapper\">\r\n	<a href=\"\" class=\"js-close-popup close-btn\"></a>\r\n	<div class=\"header\">\r\n		<a href=\"https://askfionna.com/\" class=\"js-open-url\">\r\n			<img src=\"assets/images/logo.png\" alt=\"Fiona\"/>\r\n		</a>\r\n	</div>\r\n	<div id=\"content\"></div>\r\n</div>";
},"useData":true});
templates['loader'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"loader-wrapper\">\r\n	<img src=\"assets/images/loader.gif\" alt=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.i18n : depth0)) != null ? stack1.loaderText : stack1)) != null ? stack1.message : stack1), depth0))
    + "\" />\r\n</div>";
},"useData":true});
templates['loginForm'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "<form id=\"auth-form\">\r\n	<label>\r\n		"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.i18n : depth0)) != null ? stack1.loginFormLoginLabel : stack1)) != null ? stack1.message : stack1), depth0))
    + "<br/>\r\n		<input type=\"text\" name=\"login\" class=\"input-field\" value=\""
    + alias2(((helper = (helper = helpers.loginValue || (depth0 != null ? depth0.loginValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"loginValue","hash":{},"data":data}) : helper)))
    + "\" />\r\n	</label>\r\n	<label>\r\n		"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.i18n : depth0)) != null ? stack1.loginFormPasswordLabel : stack1)) != null ? stack1.message : stack1), depth0))
    + "<br/>\r\n		<input type=\"password\" name=\"password\" class=\"input-field\" value=\"\" />\r\n	</label>\r\n	<div class=\"buttons-wrapper\">\r\n		<button class=\"btn btn_fluid\" type=\"submit\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.i18n : depth0)) != null ? stack1.loginFormLoginBtnText : stack1)) != null ? stack1.message : stack1), depth0))
    + "</button>\r\n		<button class=\"js-register btn btn_fluid btn_link\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.i18n : depth0)) != null ? stack1.loginFormRegisterBtnText : stack1)) != null ? stack1.message : stack1), depth0))
    + "</button>\r\n	</div>\r\n</form>";
},"useData":true});
templates['userInfoPanel'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"user-info-panel\" class=\"user-info-panel\">\r\n	<div class=\"user-info-item\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n	<div class=\"user-info-item\">"
    + alias4(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data}) : helper)))
    + "</div>\r\n	<div class=\"buttons-wrapper\">\r\n		<button class=\"btn btn_fluid logout js-logout\">"
    + alias4(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.i18n : depth0)) != null ? stack1.userInfoPanelLogoutBtnText : stack1)) != null ? stack1.message : stack1), depth0))
    + "</button>\r\n	</div>\r\n</div>";
},"useData":true});
})();