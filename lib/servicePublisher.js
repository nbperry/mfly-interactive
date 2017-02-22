var bonjour = require('bonjour')()

function publish(ip, port, mcode, slug) {
	bonjour.publish({
		host: ip,
		name: 'mfly-interactive server',
		type: 'https',
		port,
		subtypes: ['mfly-interactive'],
		txt: {
			mcode,
			slug
		}
	})
}

module.exports = {
	publish
}
