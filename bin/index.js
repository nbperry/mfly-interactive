#!/usr/bin/env node
var path = require('path')
var fs = require('fs')
var chalk = require('chalk')
var inquirer = require('inquirer')
var release = require('../lib/release')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

function init() {
	inquirer.prompt([{
		name: 'itemId',
		message: 'Enter Airship Item Id'
	}, {
		name: 'mcode',
		message: 'Enter Company Code'
	}, {
		name: 'slug',
		message: 'Enter Viewer Item slug'
	}, {
		name: 'productId',
		message: 'Enter Airship Product Id'
	}]).then(function (answers) {
		var data = {
			itemId: answers.itemId,
			mcode: answers.mcode,
			slug: answers.slug,
			productId: answers.productId
		}
    	fs.writeFile('mfly-interactive.config.json', JSON.stringify(data, null, 4), function() {
    		console.log(chalk.green('Initialized successfully!'))
    	})
	})
}

function upload() {
	inquirer.prompt([{
		name: 'userId',
		message: 'Enter Airship User Id'  
	}, {
		name: 'password',
		message: 'Enter Airship password',
		type: 'password'
	}]).then(function(answers) {
		var options = require(configFilePath)
		require('../lib/uploader')(answers.userId, answers.password, options.productId, options.itemId)
	})
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
	.command('init', 'Initialize', function() {
		init()
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
