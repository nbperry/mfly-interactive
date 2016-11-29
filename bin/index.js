#!/usr/bin/env node
var path = require('path')
var chalk = require('chalk')
var release = require('../lib/release')
require('../lib/updateNotifier')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')
require('../lib/configureWinston')

function upload() {
	var options = require(configFilePath)
	require('../lib/uploader')(options.accessToken, options.productId, options.itemId)
}

function serve(argv) {
	var options = require(configFilePath)
	require('../lib/server')(options)
}

function getVersion() {
	var version = require('../package').version
	return console.log(`Version: ${chalk.green(version)}`)
}

var argv = require('yargs')
	.usage('Run the Interactive with the following options.')
	.command('version', 'Get version', function(yargs) {
		getVersion()
	})
	.command('serve', 'Serves it up', function(yargs) {
		serve(yargs.argv)
	})
	.command('init', 'Initialize', function() {
		require('../lib/init')()
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
