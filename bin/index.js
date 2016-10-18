#!/usr/bin/env node
var path = require('path')
var release = require('../lib/release')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

function upload() {
	var options = require(configFilePath)
	require('../lib/uploader')(options.userId, options.password, options.productId, options.itemId)
}

function serve() {
	var options = require(configFilePath)
	require('../lib/server')(options)
}

var argv = require('yargs')
	.usage('Run the Interactive with the following options.')
	.command('serve', 'Serves it up', function() {
		serve()
	})
	.command('publish', 'Create release and upload to Airship', function() {
		upload()
	})
	.command('release', 'Create the .interactive archive', function() {
		release(err => {
			if (err) {
				console.log(err)
			}
		})
	}).argv
