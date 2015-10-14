# Mediafly Interactives proxy
Allows local development of interactives using real data.

## Installing
Before running, you must install and configure the following one-time dependencies:

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/)

## Option 1: Global install (if you are only using a static file server)

Enter the following in the terminal
```bash
$ npm install -g browser-sync mfly-interactive
```

Run in the folder where the interactive is located
```bash
$ mfly-interactive --url https://viewer.mediafly.com/interactives/interactive/9cf282320e6340ee8b830e5376d54531product184614/1441745710d55945/index.html
```

## Option 2: Local install (if you gulp, grunt, etc. with a static file server)
Enter the following in the terminal
```bash
$ npm install mfly-interactive --save-dev
```

Example of how to set up a BrowserSync server. The same can be done with a connect server as well. Here, the middleware provided by `mfly-interactive` can be supplied to the node server.
```javascript
var browserSync = require("browser-sync")
var viewerMiddleware = require('mfly-interactive')({
	url: 'https://viewer.mediafly.com/interactives/interactive/9cf282320e6340ee8b830e5376d54531product184614/1441745710d55945/index.html'
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
The BrowserSync static server that serves the interactive static files must run on HTTPS. This allows it to communicate with viewer properly.
Ignore this warning in your browser.
