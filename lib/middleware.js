var modRewrite = require('connect-modrewrite')

module.exports = function (options) {
	var exp = new RegExp('(.*)/(.*)/interactive/(.*)/index.html')
	var parts = options.url.match(exp)
	var modRewriteConfig = [
		'^(.*)/interactive/' + parts[3] + '/(.*)$ /$2 [L]',
		'^/(.*)$ ' + parts[1] + '/$1 [P, L]'
	]

	return modRewrite(modRewriteConfig)
}
