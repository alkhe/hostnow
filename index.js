#!/usr/bin/env node

let express = require('express'),
	path = require('path'),
	serveIndex = require('serve-index'),
	app = express();

let args = process.argv.slice(2),
	root = path.resolve(args[0] || process.cwd()),
	port = Number(args[1] || 80);

app.use(express.static(root, {
		dotfiles: 'allow'
	}))
	.use(serveIndex(root, {
		hidden: true,
		icons: true
	}))
	.use((req, res) => {
		res.status(404).send('404 Not Found');
	});

app.listen(port, err => {
	if (err) {
		console.log('Error', err);
		process.exit(1);
	}
	console.log('Serving ' + root + ' on port ' + port + '.');
});
