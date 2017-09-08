var fs = require('fs')
var request = require('request')
var release = require('./release')
var chalk = require('chalk')
var util = require('./util')
var path = require('path')
var yargs = require('yargs')
var getItemAssetState = require('./item').getItemAssetState

var fileSizeInBytes = 0;
var configFilePath = path.join(process.cwd(), yargs.argv.config)

function getOptions() {
	var options = fs.readFileSync(configFilePath, 'utf-8')
	return JSON.parse(options)
}

function persistNewToken(accessToken) {
	var options = getOptions()
	options.accessToken = accessToken
	fs.writeFileSync(yargs.argv.config, JSON.stringify(options, null, 4))
}

function getPresignedUrl(accessToken, productId, cb) {
	request.get({url: 'https://launchpadapi.mediafly.com/uploads/signedurl?accessToken=' + accessToken +
			'&productid=' + productId, json: true}, function(err, response, body) {
			if (!body.success) {
				//get a new token
				console.log(chalk.red('Airship session has expired. Enter your credentials again:'))
				util.renewAccessToken(function(newAccessToken) {
					persistNewToken(newAccessToken)
					getPresignedUrl(newAccessToken, productId, cb)
				})
			} else {
				cb(body.response)
			}
			if (err) {
				console.log(chalk.red('Error getting upload URL. Please check your credentials.'))
				return
			}
		})
}

function uploadInteractive(url, cb) {
	var options = getOptions()

	var stats = fs.statSync(options.filename)
	fileSizeInBytes = stats.size

	fs.createReadStream(options.filename)
		.pipe(request({
			method: 'PUT',
			headers: { 
				'Content-Type': 'application/interactive',
				'Content-Length': fileSizeInBytes
			},
			uri: url
		}, cb))
}

function updateAsset(productId, itemId, s3Url, cb) {
	var options = getOptions()
	
	var update = {
		size: fileSizeInBytes,
		type: 'document',
		contentType: 'application/interactive',
		filename: options.filename,
		url: s3Url,
		sourcetype: 's3',
		variants: []
	}

	var accessToken = getOptions().accessToken
	var url = 'https://launchpadapi.mediafly.com/2/items/' + itemId + '/asset?accessToken=' + accessToken + '&productId=' + productId

	request({
		method: 'PUT',
		uri: url,
		json: update
	}, cb)
}

function waitForIngestion(productId, itemId, cb) {
	var accessToken = getOptions().accessToken
	var timer = setInterval(() => {
		getItemAssetState(itemId, productId, accessToken, assetState => {
			if (assetState === 'processed') {
				clearInterval(timer)
				cb()
			}
		})
	}, 7000)
}


// This function will do the same as the default export for publishing except for zip up the package
module.exports.publishWithoutRelease = function(accessToken, productId, itemId) {
	
	getPresignedUrl(accessToken, productId, function(urlResponse) {
		uploadInteractive(urlResponse.signedUrl, function(err) {
			if (err) {
				console.log(chalk.red('Error uploading interactive.'))
				return
			}

			updateAsset(productId, itemId, urlResponse.url, function(err) {
				if (err) {
					console.log(chalk.red('Error updating '))
					return
				}
				console.log(chalk.green('Interactive successfully uploaded. Extracting...'))
				waitForIngestion(productId, itemId, () => {
					console.log(chalk.green('Interactive published successfully!'))
				})
			})
		})
	})
	
}

module.exports = function(accessToken, productId, itemId) {
	//zip up the current directory
	release(function() {
		getPresignedUrl(accessToken, productId, function(urlResponse) {
			uploadInteractive(urlResponse.signedUrl, function(err) {
				if (err) {
					console.log(chalk.red('Error uploading interactive.'))
					return
				}

				updateAsset(productId, itemId, urlResponse.url, function(err) {
					if (err) {
						console.log(chalk.red('Error updating '))
						return
					}
					console.log(chalk.green('Interactive successfully uploaded. Extracting...'))
					waitForIngestion(productId, itemId, () => {
						console.log(chalk.green('Interactive published successfully!'))
					})
				})
			})
		})
	})
}