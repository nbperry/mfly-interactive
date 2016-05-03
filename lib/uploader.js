var exec = require('child_process').exec
var fs = require('fs')
var https = require('https')
var path = require('path')
var request = require('request')
// require('request-debug')(request)


var fileSizeInBytes = 0;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout) })
}

function get(url, cb) {
	https.get(url, function(response) {
		var str = ''

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk
		})

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			cb(JSON.parse(str))
		})
	}).end()
}

function put(host, path) {
	https.request({
		host: 'https://launchpadapi.mediafly.com',
		method: 'PUT',
		path: '/items/' + itemId + '/updateasset?accessToken=' + accessToken + '&accessType=edit&productId=' + productId
	}, function(res) {
		var str = ''

		//another chunk of data has been recieved, so append it to `str`
		res.on('data', function (chunk) {
			str += chunk
		})

		//the whole response has been recieved, so we just print it out here
		res.on('end', function () {
			cb(JSON.parse(str).uploadToken)
		})
	}).on('error', function(e) {
		console.log('problem with request: ' + e.message)
	}).write(postData)
	.end()
}

function zipCurrentDirectory(cb) {
	execute('rm archive.interactive; zip -9 -r archive.interactive .', function() {
		console.log('Compressed the current directory')
		cb()
	})
}

function getAccessToken(username, password, cb) {
	get('https://accounts.mediafly.com/api/3.3/authentication/authenticate?accessType=edit&username=' + 
		encodeURIComponent(username) + '&password= ' + encodeURIComponent(password), function(res) {
			cb(res.accessToken)
		})
}

function getPresignedUrl(accessToken, productId, cb) {
	get('https://launchpadapi.mediafly.com/uploads/signedurl?accessToken=' + accessToken +
		'&productid=' + productId, function(res) {
			cb(res.response)
		})
}

function uploadInteractive(url, cb) {
	// fs.createReadStream('archive.interactive')
	// 	.pipe(fs.createWriteStream('archive1.interactive'))

	var stats = fs.statSync('archive.interactive')
	fileSizeInBytes = stats["size"]

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
		method: 'POST',
		uri: url,
		json: update
	}, cb)
}

module.exports = function(userId, password, productId, itemId) {
	//zip up the current directory
	var accessToken;
	zipCurrentDirectory(function() {
		getAccessToken(userId, password, function(token) {
			console.log('accessToken', token)
			accessToken = token
			getPresignedUrl(accessToken, productId, function(urlResponse) {
				console.log('signedUrl', urlResponse.signedUrl)
				url = urlResponse.url
				uploadInteractive(urlResponse.signedUrl, function(err, res, body) {
					if (err) {
						console.log('err', err)
						return
					}

					if (res.statusCode != 200) {
						console.log('upload failed: ' + body)
					}
					console.log('Upload completed')
					updateAsset(productId, accessToken, itemId, urlResponse.url, function(err, response, body) {
						if (err) {
							console.log('err', err)
							return
						}
						console.log('updated asset', response.statusCode)
					})
				})
			})
		})
	})

}