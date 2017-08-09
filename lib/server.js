var chalk = require('chalk')
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

		var manifestPath = path.join(process.cwd(), 'interactive-manifest.json')
		var manifestExists = fs.existsSync(manifestPath)	

		if (!manifestExists) {
			
			return console.log(chalk.red('WARNING: This Interactive is missing `interactive-manifest.json` file. Adding this file will allow the Interactive to leverage some important enhancements to the apps. Run command "mfly-interactive init" again to have the file added to the root of your Interactive.'))
		}

		var manifest = JSON.parse(fs.readFileSync(manifestPath))

		if (!manifest.wkwebview) {
			console.log(chalk.red('WARNING: This Interactive does not target WKWebView on iOS. Run command "mfly-interactive init" again to have configure this Interactive to target WKWebView.'))
		}
	})
}