var fs = require('fs')
var request = require('request')
var release = require('./release')
var chalk = require('chalk')

var fileSizeInBytes = 0;

function getPresignedUrl(accessToken, productId, cb) {
	request.get({url: 'https://launchpadapi.mediafly.com/uploads/signedurl?accessToken=' + accessToken +
			'&productid=' + productId, json: true}, function(err, response, body) {
			if (err) {
				console.log(chalk.red('Error getting upload URL. Please check your credentials.'))
				return
			}
			cb(body.response)
		})
}

function uploadInteractive(url, cb) {
	var stats = fs.statSync('archive.interactive')
	fileSizeInBytes = stats.size

	fs.createReadStream('archive.interactive')
		.pipe(request({
			method: 'PUT',
			headers: { 
				'Content-Type': 'application/interactive',
				'Content-Length': fileSizeInBytes
			},
			uri: url
		}, cb))
}

function updateAsset(productId, accessToken, itemId, s3Url, cb) {
	var update = {
		size: fileSizeInBytes,
		type: 'document',
		contentType: 'application/interactive',
		filename: 'archive.interactive',
		url: s3Url,
		sourcetype: 's3',
		variants: []
	}

	var url = 'https://launchpadapi.mediafly.com/2/items/' + itemId + '/asset?accessToken=' + accessToken + '&productId=' + productId

	request({
		method: 'PUT',
		uri: url,
		json: update
	}, cb)
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

				updateAsset(productId, accessToken, itemId, urlResponse.url, function(err) {
					if (err) {
						console.log(chalk.red('Error updating '))
						return
					}
					console.log(chalk.green('Interactive successfully updated.'))
				})
			})
		})
	})
}