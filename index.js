#!/usr/bin/env node

let express = require('express'),
	path = require('path'),
	fs = require('fs'),
	app = express();

let args = process.argv.slice(2),
	root = path.resolve(args[0] || process.cwd()),
	port = Number(args[1] || 80);

app.use((req, res, next) => {
	req.path = unescape(req.path);
	next();
});

app.use(express.static(root, {
	dotfiles: 'allow'
}));

app.get('*', (req, res) => {
	let local = req.path,
		absolute = path.join(root, local),
		children = ['.', '..'].concat(fs.readdirSync(absolute));

	let childToHtml = c =>
		`<a href='${ path.join(local, c) }'>${ c }</a>`;

	let links = children.map(childToHtml).join('<br />');

	res.send(links);
});

app.listen(port, err => {
	if (err) {
		console.log('Error', err);
		process.exit(1);
	}
	console.log('Serving ' + root + ' on port ' + port + '.');
});
