var browserSync = require('browser-sync')
var guid = require('./guid')()

module.exports = function(options) {
	var viewerMiddleware = require('./middleware')(options)
	var logger = require('./socketLogger')
	var injectorMiddleware = require('./injectorMiddleware')

	var exp = new RegExp('(.*)/(.*)/interactive/(.*)/index.html')
	var mcode = options.mcode

	//Deprecated option url
	if (options.url) {
		mcode = options.url.match(exp)[2]		
	}

	//Allow any SSL certificate
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

	browserSync({
		files: './**',
		https: true,
		open: options.open || true,
		startPath: '/' + mcode,
		server: {
			baseDir: '.',
			middleware: [
				viewerMiddleware,
				injectorMiddleware
			]
		}
	}, function(err, bs) {
		logger(bs.io.sockets)
	})

	console.log('For weinre support, add this script tag in the index.html of your Interactive', '<script src="https://weinre.mybluemix.net/target/target-script-min.js#' + guid + '"></script>')
	console.log('Open URL in your browser: https://weinre.mybluemix.net/client#' + guid)
}