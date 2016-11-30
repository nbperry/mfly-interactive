var fs = require('fs')
var chalk = require('chalk')
var zipFolder = require('zip-folder')

module.exports = function zipCurrentDirectory(cb) {
	var Spinner = require('cli-spinner').Spinner
	var spinner = new Spinner('Generating archive.interactive...')
	spinner.setSpinnerString(1)
	spinner.start()
	try {
		fs.unlinkSync('./archive.interactive')
	} catch(err) {}
	zipFolder(process.cwd(), './archive.interactive', function() {
		spinner.stop()
		console.log(chalk.green('Created archive.interactive.'))
		cb()
	})
}