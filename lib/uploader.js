var fs = require('fs')
var request = require('request')
var release = require('./release')

var fileSizeInBytes = 0;

function getAccessToken(username, password, cb) {
	var url = 'https://accounts.mediafly.com/api/3.3/authentication/authenticate?accessType=edit&username=' + 
			encodeURIComponent(username) + '&password= ' + encodeURIComponent(password)

	request.get({url: url, json: true}, function(err, response, body) {
			if (err) {
				console.error('Error authenticating. Please check your credentials.')
				return
			}
			cb(body.accessToken)
		})
}

function getPresignedUrl(accessToken, productId, cb) {
	request.get({url: 'https://launchpadapi.mediafly.com/uploads/signedurl?accessToken=' + accessToken +
			'&productid=' + productId, json: true}, function(err, response, body) {
			console.log('response', response)
			console.log('body', body)
			if (err) {
				console.error('Error getting upload URL. Please check your credentials.')
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

module.exports = function(userId, password, productId, itemId) {
	//zip up the current directory
	var accessToken
	release(function() {
		getAccessToken(userId, password, function(token) {
			accessToken = token
			getPresignedUrl(accessToken, productId, function(urlResponse) {
				uploadInteractive(urlResponse.signedUrl, function(err) {
					if (err) {
						console.error('Error uploading interactive.')
						return
					}

					updateAsset(productId, accessToken, itemId, urlResponse.url, function(err) {
						if (err) {
							console.error('Error updating ')
							return
						}
						console.log('Interactive successfully updated.')
					})
				})
			})
		})
	})
}