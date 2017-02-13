var browserSync = require('browser-sync')
var ip = require('ip')
var fs = require('fs')
var path = require('path')
var logClient = fs.readFileSync(
	path.join(__dirname, 'public/logClient.js'), { encoding: 'UTF-8' }
)

module.exports = function(options) {
	var viewerMiddleware = require('./middleware')(options)
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
		open: 'external',
		startPath: '/' + mcode,
		rewriteRules: [{
			match: /<head>/i,
			replace: '<head><script>' + logClient +'</script>'
		}],
		watchOptions: {
			ignoreInitial: true,
			ignored: [ '**/*.log' ]
		},
		server: {
			baseDir: '.',
			middleware: [
				viewerMiddleware
			]
		}
	}, function(err, bs) {
		require('./socketLogger')(bs.io.sockets)
		require('./servicePublisher').publish(ip.address(), bs.options.get('port'), options.mcode, options.slug)
	})
}