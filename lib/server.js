module.exports = function(url) {
	var browserSync = require('browser-sync')
	var guid = require('./guid')()

	var viewerMiddleware = require('./middleware')({
		url: url
	})

	var exp = new RegExp('(.*)/(.*)/interactive/(.*)/index.html')
	var parts = url.match(exp)

	//Allow any SSL certificate
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

	browserSync({
		files: './**',
		https: true,
		// startPath: '/' + parts[2] + '/interactive/' + parts[3] + '/index.html',
		server: {
			baseDir: '.',
			middleware: [
				viewerMiddleware
			]
		}
	})

	console.log('For weinre support, add this script tag in the index.html of your Interactive', '<script src="https://weinre.mybluemix.net/target/target-script-min.js#' + guid + '"></script>')
	console.log('Open URL in your browser: https://weinre.mybluemix.net/client#' + guid)
}