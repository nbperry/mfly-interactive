# Mediafly Interactives


## Developing an Interactive in the browser:

To start developing a new Interactive:

1. Upload the Interactive in Airship.
2. Get the URL of the Interactive from Viewer.
3. Use that URL with this tool.

**Please note that local changes to the Interactive will not update the uploaded Interactive. When finished making changes, you will need to upload the Interactive in Airship again.**

### Option 1: Global install (if you are not using build tools such as gulp)

Enter the following in the terminal

```
$ npm install -g mfly-interactive
```

Run in the folder where the Interactive is located. You can locate the url by navigating to the Interactive in the [web viewer](https://viewer.mediafly.com).

```
$ mfly-interactive --url https://viewer.mediafly.com/.../index.html
```

### Option 2: Local install (if you have gulp, grunt, etc. with a static file server)

This package can also be used as a node.js middleware. You can plug in this middleware in the static file server responsible for serving up your Interactive.


Enter the following in the terminal

```
$ npm install mfly-interactive --save-dev
```

Here is an example of how to set up a [BrowserSync](http://www.browsersync.io/) server. The same can be done with any connect server as well. Here, the middleware provided by `mfly-interactive` can be supplied to your server.

```
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

## Publishing an Interactive

Once you are ready to test the Interactive on other platforms, or if you are ready to publish it for your users, you can publish it by using the following command.

```
$ mfly-interactive --user-id {userId} --password {password} --productId {productId} --itemId {itemId}
```

Here is how to retrieve the arguments needed for the command above:

- `user-id`: This is the username used to log into Airship.
- `password`: Password when logging into Airship.
- `productId`: The ID of your Airship product/content source.  This is the same as the content source slug.
- `itemId`: This is the ID of the Interactive in Airship.


## A note on HTTPS
Your browser will show a warning about HTTPs. Ignore this warning.
