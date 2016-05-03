#!/usr/bin/env node

var options = require('yargs')
	.usage('Run the Interactive with the following options.')
	.option('url', {
		alias: 'u',
		description: 'viewer url to the Interactive.',
		type: 'string'
	})
	.option('userId', {
		description: 'airship userId.',
		type: 'string'
	})
	.option('password', {
		description: 'airship password.',
		type: 'string'
	})
	.option('productId', {
		description: 'viewer productId.',
		type: 'string'
	})
	.option('itemId', {
		description: 'airship itemId.',
		type: 'string'
	})
	.argv

if (options.url) {
	//start the server
	require('../lib/server')(options.url)	
} else if (options.userId && options.password && options.productId && options.itemId) {
	require('../lib/uploader')(options.userId, options.password, options.productId, options.itemId)
} else {
	console.log('Invalid command line options')
} 

