var bonjour = require('bonjour')()

function publish(ip, port, mcode, slug) {
	bonjour.publish({
		host: ip,
		name: 'mfly-interactive server',
		type: 'https',
		port,
		txt: {
			mcode,
			slug
		}
	})
}

module.exports = {
	publish
}
