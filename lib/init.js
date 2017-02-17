var inquirer = require('inquirer')
var util = require('./util')
var fs = require('fs')
var chalk = require('chalk')
var opn = require('opn')
var path = require('path')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

function getAccessToken(mcode, authType) {
	if (authType === 'Url') {
		//this content source is SAML
		console.log('Open Chrome with https://login.mediafly.com/pepsi0716#/login?returnUrl=https:%2F%2Fgoogle.com')
		return opn(`https://login.mediafly.com/${mcode}#/login?returnUrl=https:%2F%2Fgoogle.com`).then(() => {
			return inquirer.prompt([{
				name: 'accessToken',
				message: 'Enter Access Token'
			}]).then(({accessToken}) => accessToken)
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
		}]).then(({userId, password}) => {
			return new Promise((resolve) => {
				util.getAccessToken(userId, password, (accessToken) => resolve(accessToken))
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
	}]).then(({mcode}) => {
		util.getProduct(mcode, ({ id: productId, authentication: { authenticationType: authType } }) => {
			getAccessToken(mcode, authType)
				.then(accessToken => {
					inquirer.prompt([{
						default: options.itemId,
						name: 'itemId',
						message: 'Enter Airship Item Id'
					}, {
						default: process.cwd().split(path.sep).pop(),
						name: 'filename',
						message: 'Enter the name of the .interactive file'
					}]).then(({itemId, filename}) => {
						util.getViewerItemSlug(itemId, accessToken, productId, (slug) => {

							var data = {
								filename: filename + '.interactive',
								accessToken: accessToken,
								itemId: itemId,
								mcode: mcode,
								slug: slug,
								productId: productId
							}

							fs.writeFile('mfly-interactive.config.json', JSON.stringify(data, null, 4), () => {
								console.log(chalk.green('Initialized successfully!'))
							})
						})
					})
				})
		})
	})
}