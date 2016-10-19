function logToServer(arg) {
	___browserSync___.socket.emit('log', arg)
}

function highjackConsole() {
	var oldLog = console.log

	console.log = function(arg) {
		logToServer(arg)
		oldLog()
	}
}

highjackConsole()

