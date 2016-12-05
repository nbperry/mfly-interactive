# Mediafly Interactives

## Initialize

Initialize `mfly-interactive` with

	mfly-interactive init

Information collected from questions asked by this command is stored in `mfly-interactive.config.json` at the root of your Interactive. Be sure to add mfly-interactive.config.json to your `.gitignore` file.

## Developing an Interactive in the browser:

To start developing a new Interactive:

1. Upload the Interactive in Airship.
2. Create a `mfly-interactive.config.json` file at the root of your Interactive.

**Please note that local changes to the Interactive will not update the uploaded Interactive. When finished making changes, you will need to upload the Interactive in Airship again.**

### Option 1: Global install (if you are not using build tools such as gulp)

Enter the following in the terminal

```
$ npm install -g mfly-interactive
```

Run in the folder where the Interactive is located.


	$ mfly-interactive serve


### Option 2: Local install (if you have gulp, grunt, etc. with a static file server)

This package can also be used as a node.js middleware. You can plug in this middleware in the static file server responsible for serving up your Interactive.


Enter the following in the terminal


	$ npm install mfly-interactive --save-dev


Here is an example of how to set up a [BrowserSync](http://www.browsersync.io/) server. The same can be done with any connect server as well. Here, the middleware provided by `mfly-interactive` can be supplied to your server.


	var browserSync = require("browser-sync")
	var options = require('./mfly-interactive.config.json')
	//Viewer slug is required here
	options.slug = '{VIEWER_SLUG}'
	var viewerMiddleware = require('mfly-interactive')(options)
	
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

## Publishing an Interactive

Once you are ready to test the Interactive on other platforms, or if you are ready to publish it for your users, you can publish it by using the following command.


	$ mfly-interactive publish


## Configuring with mfly-interactive.config.json

 You can use the config file `mfly-interactive.config.json` to configure the behavior of this tool. Here is an example config file:


	{
		"itemId": "{AIRSHIP ITEM Id}",
		"mcode": "{Company Code}",
		"slug": "{Viewer Item Slug}",
		"productId": "{Product Id}"
	}

## A note on HTTPS
Your browser will show a warning about HTTPs. Ignore this warning.
