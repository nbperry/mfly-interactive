module.exports = function(sockets) {
	sockets.on('connection', function(socket) {
		socket.on('log', function(data) {
			console.log('data', data)
		})
	})
}