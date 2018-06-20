# README #

## How to compile Handlebars templates? ###

* Install handlebarsjs using npm:
```
$ npm install handlebars -g
```
* Compile all templates files:
 ```
handlebars templates -f src/js/templatesCompiled.js --extension "hbs"
 ```
Read more about template precompilation:
- http://handlebarsjs.com/precompilation.html 
- http://matthewrobertson.org/blog/2012/07/10/javascript-templates-and-chromes-content-security-policy/