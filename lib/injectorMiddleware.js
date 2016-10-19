var fs = require('fs')
var path = require('path')
var logClient = fs.readFileSync(path.join(__dirname, 'public/logClient.js'), { encoding: 'UTF-8' })
module.exports = require('connect-inject')({ snippet: '<script>' + logClient +'</script>' })