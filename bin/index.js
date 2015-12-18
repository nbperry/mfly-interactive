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

var browserSync = require("browser-sync")
var viewerMiddleware = require('../lib/middleware')({
	url: url
})

browserSync({
	files: './**',
	https: true,
	server: {
		baseDir: '.',
		middleware: [
			viewerMiddleware
		]
	}
})
