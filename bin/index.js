#!/usr/bin/env node
var path = require('path')
var chalk = require('chalk')
var release = require('../lib/release')
require('../lib/updateNotifier')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')
require('../lib/configureWinston')

function upload() {
	var options = require(configFilePath)
	require('../lib/publish')(options.accessToken, options.productId, options.itemId)
}

function serve() {
	var options = require(configFilePath)
	require('../lib/server')(options)
}

function getVersion() {
	var version = require('../package').version
	return console.log(`Version: ${chalk.green(version)}`)
}

require('yargs')
	.usage('Run the Interactive with the following options.')
	.command('version', 'Get version', function() {
		getVersion()
	})
	.command('serve', 'Serves it up', function() {
		serve()
	})
	.command('init', 'Initialize', function() {
		require('../lib/init')()
	})
	.command('publish', 'Create release and upload to Airship', function() {
		upload()
	})
	.command('release', 'Create the .interactive archive', function() {
		release(function(err) {
			if (err) {
				console.log(err)
			}
		})
	}).argv
