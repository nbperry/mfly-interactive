var fs = require('fs')
var chalk = require('chalk')
var zipFolder = require('zip-folder')
var path = require('path')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')

module.exports = function zipCurrentDirectory(cb) {
	var filename = require(configFilePath).filename

	var Spinner = require('cli-spinner').Spinner
	var spinner = new Spinner('Generating ' + filename + '...')
	spinner.setSpinnerString(1)
	spinner.start()

	try {
		fs.unlinkSync(filename)
	} catch(err) {}
	
	zipFolder(process.cwd(), 'archive.interactive', function() {
		fs.renameSync('archive.interactive', filename)
		spinner.stop()
		console.log(chalk.green('Created ' + filename))
		cb()
	})
}