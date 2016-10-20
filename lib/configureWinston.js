var winston = require('winston')
var path = require('path')
var fs = require('fs')

var logPath = path.join(process.cwd(), 'logs')
var logFilePath = path.join(logPath, 'all.log')

// https://github.com/winstonjs/winston/issues/875
var dirExists = fs.existsSync(logPath);

if (!dirExists) {
	fs.mkdirSync(logPath)
}

var logExists = fs.existsSync(logFilePath)

if (!logExists) {
	fs.writeFileSync(logFilePath, '')
}

winston.remove(winston.transports.Console)
winston.add(winston.transports.File, {
	level: 'silly',
	filename: path.join(process.cwd(), 'logs/all.log'),
	maxSize: 10000000,
	json: false,
	colorize: true
})

winston.add(winston.transports.Console, {
	level: 'silly',
	json: false,
	colorize: true
})
