var inquirer = require('inquirer')
var util = require('./util')
var fs = require('fs')
var chalk = require('chalk')
var opn = require('opn')
var path = require('path')
var Q = require('q')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

function getAccessToken(mcode, authType) {
	if (authType === 'Url') {
		//this content source is SAML
		console.log('Log in with your credentials in the newly opened browser window.')
		console.log('Once you have logged in, copy the Access Token and paste it below.')
		return opn(`https://login.mediafly.com/${mcode}#/login
			?returnUrl=https%3A%2F%2Fmediafly-mfly-interactive.s3.amazonaws.com%2Faccess-token.html`, { wait: false }).then(function() {
			return inquirer.prompt([{
				name: 'accessToken',
				message: 'Enter Access Token'
			}]).then(function(answers) { return answers.accessToken })
		})
	} else {
		//this is a regular content source
		return inquirer.prompt([{
			name: 'userId',
			message: 'Enter Airship User Id'  
		}, {
			name: 'password',
			message: 'Enter Airship password',
			type: 'password'
		}]).then(function(answers) {
			return new Q.Promise(function(resolve) {
				util.getAccessToken(answers.userId, answers.password, function(accessToken) {
					resolve(accessToken)
				})
			})
		})
	}
}

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
			getAccessToken(answers.mcode, product.authentication.authenticationType)
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

							fs.writeFile('mfly-interactive.config.json', JSON.stringify(data, null, 4), function() {
								console.log(chalk.green('Initialized successfully!'))
							})
						})
					})
				})
		})
	})
}