var fs = require('fs')
var path = require('path')
var logClient = fs.readFileSync(path.join(__dirname, 'public/logClient.js'), { encoding: 'UTF-8' })

function prepend(w, s) {
	console.log('w', w)
	console.log('s', s)
	return w
}

module.exports = function(req, res, next) {
	var inject = require('connect-inject')({ 
		rules: [{
			match: /<head>/,
			fn: prepend,
			snippet: '<script>' + logClient +'</script>'
		}]
	})
	inject(req, res, next)
}
