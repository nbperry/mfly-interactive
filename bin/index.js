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
	.option('mcode', {
		description: 'Company code from Viewer',
		type: 'string'
	})
	.option('ip', {
		description: "Your machine's IP address",
		type: 'string'
	})
	.option('slug', {
		description: 'The ID of the Interactive in Viewer',
		type: 'string'
	})
	.option('viewerDomain', {
		description: 'Viewer domain to proxy to',
		type: 'string',
		default: 'https://viewer.mediafly.com'
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

	var options

	if (configFileExists) {
		options = require(configFilePath)
	} else {
		options = argv
	}

	if (!options.viewerDomain) {
		options.viewerDomain = argv.viewerDomain
	}

	return options
}

var options = getOptions()

function upload(options) {
	require('../lib/uploader')(options.userId, options.password, options.productId, options.itemId)
}

function serve(options) {
	console.log('options', options)
	require('../lib/server')(options)
}

var hasSubCommand = argv._.includes('upload') || argv._.includes('release')

function canServe(options) {
	return options.url || (options.slug && options.viewerDomain)
}

if (canServe) {
	serve(options)
} else if(!hasSubCommand) {
	console.error('Insufficient options supplied. Please refer to the documentation at https://www.npmjs.com/package/mfly-interactive on how to supply the necessary options by creating mfly-interactive.config.json or by command line arguments.')
} 
