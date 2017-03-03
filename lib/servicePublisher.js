var bonjour = require('bonjour')()
var _ = require('lodash')

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

function cleanup() {
	console.log('Exiting mfly-interactive')
	bonjour.unpublishAll(() => bonjour.destroy())
}

process.on('exit', () => {
	if (_.includes(process.argv, 'serve')) {
		cleanup()
	}
})

process.on('SIGINT', () => {
	process.exit(0)
})

module.exports = {
	publish
}
