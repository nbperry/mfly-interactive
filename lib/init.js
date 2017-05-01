var inquirer = require('inquirer')
var util = require('./util')
var fs = require('fs')
var chalk = require('chalk')
var path = require('path')
var yargs = require('yargs')
var configFilePath = path.join(process.cwd(), yargs.argv.config)

module.exports = function init() {
	var options = {}
	try {
		options = require(configFilePath)
	} catch (err) {}

	inquirer.prompt([{
		default: options.mcode || 'interactives',
		name: 'mcode',
		message: 'Enter Company Code'
	}]).then(function(answers) {
		var mcode = answers.mcode
		util.getProduct(answers.mcode, function(product) {
			util.promptForAccessToken(answers.mcode, product.authentication.authenticationType)
				.then(function(accessToken) {
					inquirer.prompt([{
						default: options.itemId,
						name: 'itemId',
						message: 'Enter Airship Item Id'
					}, {
						default: process.cwd().split(path.sep).pop(),
						name: 'filename',
						message: 'Enter the name of the .interactive file'
					}]).then(function(answers) {
						util.getViewerItemSlug(answers.itemId, accessToken, product.id, function(slug) {

							var data = {
								filename: answers.filename + '.interactive',
								accessToken: accessToken,
								itemId: answers.itemId,
								mcode: mcode,
								slug: slug,
								productId: product.id
							}

							fs.writeFile(yargs.argv.config, JSON.stringify(data, null, 4), function() {
								console.log(chalk.green('Initialized successfully!'))
							})
						})
					})
				})
		})
	})
}