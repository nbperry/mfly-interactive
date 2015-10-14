#!/usr/bin/env node

var options = require('yargs')
	.usage('Run the interactive with the following options.')
	.help('?')
	.option('url', {
		alias: 'u',
		required: true,
		description: 'viewer url to the interactive.',
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
