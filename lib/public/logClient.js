setTimeout(function() {

	var bs = ___browserSync___
	function logToServer(arg, metadata) {
		metadata.deviceType = mflyCommands.getDeviceType()
		bs.socket.emit('log', arg, metadata)
	}

	function newConsole() {
		var oldLog = console.log
		var oldError = console.error
		var oldAssert = console.assert

		console.log = function(arg) {
			if (!arg) { return }
			logToServer(arg, { level: 'log' })
			oldLog.apply(console, arguments)
		}

		console.error = function(arg) {
			if (!arg) { return }
			logToServer(arg, { level: 'error' })
			oldError.apply(console, arguments)
		}

		console.assert = function(arg) {
			if (!arg) { return }
			logToServer(arg, { level: 'assert' } )
			oldAssert.apply(console, arguments)
		}
	}

	var callback = function(stackframes) {
		var stringifiedStack = stackframes.map(function(sf) {
			return sf.toString()
		}).join('\n')

		console.log(stringifiedStack)
	}

	var errback = function(err) { console.log(err.message) }

	window.onerror = function(msg, file, line, col, error) {
		// callback is called with an Array[StackFrame]
		StackTrace.fromError(error).then(callback).catch(errback)
	}

	newConsole()

}, 1000)
