#!/usr/bin/env node

var options = require('yargs')
	.usage('Run the Interactive with the following options.')
	.option('url', {
		alias: 'u',
		required: true,
		description: 'viewer url to the Interactive.',
		type: 'string'
	})
	.argv

var url = options.url

var browserSync = require('browser-sync')
var open = require('open')
var guid = require('../lib/guid')()

var viewerMiddleware = require('../lib/middleware')({
	url: url
})

var exp = new RegExp('(.*)/(.*)/interactive/(.*)/index.html')
var parts = options.url.match(exp)

browserSync({
	files: './**',
	https: true,
	startPath: '/' + parts[2] + '/interactive/' + parts[3] + '/index.html',
	server: {
		baseDir: '.',
		middleware: [
			viewerMiddleware
		]
	}
})

console.log('For weinre support, add this script tag in the index.html of your Interactive', '<script src="https://weinre.mybluemix.net/target/target-script-min.js#' + guid + '"></script>')

open('https://weinre.mybluemix.net/client#' + guid)
