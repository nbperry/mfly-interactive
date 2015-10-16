# Mediafly Interactives
Allows development of Mediafly Interactives using real data.

To start developing a new Interactive:
1. Upload the Interactive in Airship.
2. Get the URL of the Interactive from Viewer.
3. Use that URL with this tool.

**Please note that local changes to the Interactive will not update the uploaded Interactive. When finished making changes, you will need to upload the Interactive in Airship again.**

## Installing
Before running, you must install and configure the following one-time dependencies:

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/)

## Option 1: Global install (if you are only using a static file server)

Enter the following in the terminal
```bash
$ npm install -g browser-sync mfly-interactive
```

Run in the folder where the Interactive is located
```bash
$ mfly-interactive --url https://viewer.mediafly.com/.../index.html
```

## Option 2: Local install (if you have gulp, grunt, etc. with a static file server)
Enter the following in the terminal
```bash
$ npm install mfly-interactive --save-dev
```

Here is an example of how to set up a [BrowserSync](http://www.browsersync.io/) server. The same can be done with any connect server as well. Here, the middleware provided by `mfly-interactive` can be supplied to your server.
```javascript
var browserSync = require("browser-sync")
var viewerMiddleware = require('mfly-interactive')({
	url: 'https://viewer.mediafly.com/.../index.html'
})

browserSync({
	files: 'app/**',
	https: true,
	server: {
		baseDir: './app',
		middleware: [
			viewerMiddleware
		]
	}
})

```

## A note on HTTPS
Your browser will show a warning about HTTPs. Ignore this warning.
