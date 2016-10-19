var fs = require('fs')
var chalk = require('chalk')
var zipFolder = require('zip-folder')

module.exports = function zipCurrentDirectory(cb) {
	try {
		fs.unlinkSync('./archive.interactive')
	} catch(err) {}
	zipFolder(process.cwd(), './archive.interactive', cb)
	console.log(chalk.green('Created archive.interactive.'))
}