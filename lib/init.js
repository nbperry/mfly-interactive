var inquirer = require('inquirer')
var util = require('./util')
var fs = require('fs')
var chalk = require('chalk')

module.exports = function init() {
	inquirer.prompt([{
		name: 'userId',
		message: 'Enter Airship User Id'  
	}, {
		name: 'password',
		message: 'Enter Airship password',
		type: 'password'
	}, {
		name: 'itemId',
		message: 'Enter Airship Item Id'
	}, {
		name: 'mcode',
		message: 'Enter Company Code'
	}]).then(function (answers) {

		util.getAccessToken(answers.userId, answers.password, function(accessToken) {
			util.getProduct(answers.mcode, function(product) {
				util.getViewerItemSlug(answers.itemId, accessToken, product.id, function(slug) {

					var data = {
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