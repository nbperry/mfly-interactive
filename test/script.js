var _ = require('lodash')
var assert = require('assert')
var request = require('request')
var exec = require('child_process').exec
var existsSync = require('fs').existsSync
var readFileSync = require('fs').readFileSync
var writeFileSync = require('fs').writeFileSync
var config = require('./app/mfly-interactive.config')
var getItemAssetState = require('../lib/item').getItemAssetState
var uuid = require('uuid/v1')
var uniqueId = uuid()

describe('mfly-interactive', () => {
	it('Canary test should pass', () => {
		assert.equal(true, true, 'Canary test should pass')
	})

	it('Should display version from version command', done => {
		exec('node bin/index version', (err, stdout) => {
			assert(new RegExp(/Version: \d+.\d+.\d+/).test(stdout), stdout + ' is invalid')
			done(err)
		});	
	})

	it('Should produce .interactive file from release command', done => {
		exec('rm test/app/app.interactive', () => {
			exec('node ../../bin/index release', { cwd: 'test/app' }, err => {
				assert(existsSync('test/app/app.interactive'), 'app.interactive was not created by the release command')
				done(err)
			})
		})
	})

	it('Should publish an interactive', function(done) {
		this.timeout(5 * 60 * 1000)
		function transformHtml() {
			var html = readFileSync('test/app/index.test.html', { encoding: 'ascii' })
			var transformedHtml =_.template(html)({ timestamp: uniqueId })
			writeFileSync('test/app/index.html', transformedHtml, { encoding: 'ascii' })
		}

		function waitUntilAssetStateIsProcessed(cb) {
			var timer = setInterval(() => {
				getItemAssetState(config.itemId, config.productId, config.accessToken, assetState => {
					if (assetState === 'processed') {
						clearInterval(timer)
						cb()
					}
				})
			}, 7000)
		}

		function verifyInteractivePublished(cb) {
			request('https://d3ckn119ow13s4.cloudfront.net/' + config.mcode + '/' + config.slug + '/index.html', (err, response, body) => {
				if (!err && response.statusCode === 200) {
					assert(body.indexOf('<div class="testing">' + uniqueId + '</div>') > 0)
				}
				cb(err)
			})
		}
			
		transformHtml()
		exec('rm test/app/app.interactive', () => {
			exec('node ../../bin/index publish', { cwd: 'test/app' }, () => {
				//verify interactive was published
				waitUntilAssetStateIsProcessed(() => {
					//now verify the change to index.html was actually extracted to S3
					verifyInteractivePublished(done)
				})
			})
		})
	})
})


// function publishTest() {
// }
