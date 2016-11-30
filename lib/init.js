var inquirer = require('inquirer')
var util = require('./util')
var fs = require('fs')
var chalk = require('chalk')
var path = require('path')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

module.exports = function init() {
	var options = {}
	try {
		options = require(configFilePath)
	} catch (err) {}

	inquirer.prompt([{
		name: 'userId',
		message: 'Enter Airship User Id'  
	}, {
		name: 'password',
		message: 'Enter Airship password',
		type: 'password'
	}, {
		default: options.itemId,
		name: 'itemId',
		message: 'Enter Airship Item Id'
	}, {
		default: options.mcode || 'interactives',
		name: 'mcode',
		message: 'Enter Company Code'
	}, {
		default: options.filename || 'archive',
		name: 'filename',
		message: 'Enter the name of the .interactive file'
	}]).then(function (answers) {

		util.getAccessToken(answers.userId, answers.password, function(accessToken) {
			util.getProduct(answers.mcode, function(product) {
				util.getViewerItemSlug(answers.itemId, accessToken, product.id, function(slug) {

					var data = {
						filename: answers.filename + '.interactive',
						accessToken: accessToken,
						itemId: answers.itemId,
						mcode: answers.mcode,
						slug: slug,
						productId: product.id
					}
					
			    	fs.writeFile('mfly-interactive.config.json', JSON.stringify(data, null, 4), function() {
			    		console.log(chalk.green('Initialized successfully!'))
			    	})
				})
			})
		})
	})
}