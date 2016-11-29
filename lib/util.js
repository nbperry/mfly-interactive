var request = require('request')
var chalk = require('chalk')

function getViewerItemSlug(itemId, accessToken, productId, cb) {
	var url = 'https://launchpadapi.mediafly.com/2/items/' + itemId +
		'?accessToken=' + accessToken + '&productId=' + productId

	request.get({url: url, json: true}, function(err, response, item) {
			if (err) {
				console.log(chalk.red('Error getting viewer item slug.'))
				return
			}
			cb(item.response.slug)
		})
}

function getProduct(mcode, cb) {
	var url = 'https://accounts.mediafly.com/api/3.0/products/get?mcode=' + mcode + '&accessToken=__anonymous__'

	request({
		json: true,
		uri: url
	}, function(err, response, product) {
		cb(product)
	})
}

function getAccessToken(username, password, cb) {
	var url = 'https://accounts.mediafly.com/api/3.3/authentication/authenticate?accessType=edit&username=' + 
			encodeURIComponent(username) + '&password= ' + encodeURIComponent(password)

	request.get({url: url, json: true}, function(err, response, body) {
			if (err) {
				console.log(chalk.red('Error authenticating. Please check your credentials.'))
				return
			}
			cb(body.accessToken)
		})
}

module.exports = {
	getAccessToken: getAccessToken,
	getViewerItemSlug: getViewerItemSlug,
	getProduct: getProduct
}