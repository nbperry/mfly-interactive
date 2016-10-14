#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var release = require('../lib/release')

var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

var argv = require('yargs')
	.usage('Run the Interactive with the following options.')
	.command('upload', 'zip and upload to Airship', function(yargs) {
		var options = getOptions(yargs.argv)
		upload(options)
	})
	.command('release', 'create the .interactive archive', function() {
		release(function(err) {
			if (err) {
				console.error(err)
			}
		})
	})
	.option('url', {
		alias: 'u',
		description: 'viewer url to the Interactive.',
		type: 'string'
	})
	.option('userId', {
		description: 'airship userId.',
		type: 'string'
	})
	.option('password', {
		description: 'airship password.',
		type: 'string'
	})
	.option('productId', {
		description: 'viewer productId.',
		type: 'string'
	})
	.option('itemId', {
		description: 'airship itemId.',
		type: 'string'
	}).argv

function getOptions() {
	var configFileExists = false

	try {
		if (fs.statSync(configFilePath).isFile()) {
			configFileExists = true
		}
	} catch (error) {}

	var options = {}

	if (configFileExists) {
		options = require(configFilePath)
	} else {
		options = argv
	}

	return options
}

function upload(options) {
	require('../lib/uploader')(options.userId, options.password, options.productId, options.itemId)
}

function serve(options) {
	require('../lib/server')(options.url)
}

var options = getOptions()

if (options.url && !argv._.includes('upload') && !argv._.includes('release')) {
	serve(options)
} else if(!argv._.includes('upload') && !argv._.includes('release')) {
	console.error('Insufficient options supplied. Please refer to the documentation at https://www.npmjs.com/package/mfly-interactive on how to supply the necessary options by creating mfly-interactive.config.json or by command line arguments.')
} 
