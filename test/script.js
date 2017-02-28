var assert = require('assert')
var exec = require('child_process').exec

function canaryTest() {
	assert.equal(true, true, 'Canary test should pass')
}

function versionTest() {
	exec('node bin/index version', (error, stdout, stderr) => {
		if (error) {
			assert.fail(error, null, 'error getting version' + stderr)
		}
		assert(new RegExp(/Version \d+.\d+.\d+/).test(stdout), stdout + ' is invalid')
	});	
}

canaryTest()
versionTest()
