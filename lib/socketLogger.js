var winston = require('winston')

module.exports = function(sockets) {
	sockets.on('connection', function(socket) {
		socket.on('log', function(data) {
			switch(data.level){
				case 'error':
					winston.error(data.message)
					break
				case 'log':
					winston.info(data.message)
					break
				case 'assert':
					winston.warn(data.message)
					break
			}
		})
	})
}