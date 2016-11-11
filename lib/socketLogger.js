var winston = require('winston')

module.exports = function(sockets) {
	sockets.on('connection', function(socket) {
		socket.on('log', function(data) {
			switch(data.level){
				case 'error':
					winston.error(data.message, { deviceType: data.deviceType })
					break
				case 'log':
					winston.info(data.message, { deviceType: data.deviceType })
					break
				case 'assert':
					winston.warn(data.message, { deviceType: data.deviceType })
					break
			}
		})
	})
}