var modRewrite = require('connect-modrewrite')

module.exports = function (options) {
	var exp = new RegExp('(.*)/interactive/(.*)/index.html')
	var parts = options.url.match(exp)
	var modRewriteConfig = [
		'^(.*)/interactive/' + parts[2] + '/(.*)$ /$2 [L]',
		'^/(.*)$ https://viewer.mediafly.com/$1 [P, L]'
	]

	return modRewrite(modRewriteConfig)
}
