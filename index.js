#!/usr/bin/env node

let express = require('express'),
	path = require('path'),
	fs = require('fs'),
	app = express();

let args = process.argv.slice(2),
	root = path.resolve(args[0] || process.cwd()),
	port = Number(args[1] || 80);

app.use(express.static(root, {
	dotfiles: 'allow'
}));

app.get('*', (req, res, next) => {
	let local = unescape(req.path),
		absolute = path.join(root, local);

	if (!fs.existsSync(absolute)) return next();

	let children = ['.', '..'].concat(fs.readdirSync(absolute));

	let childToHtml = c =>
		`<a href='${ path.join(local, c) }'>${ c }</a>`;

	let links = children.map(childToHtml).join('<br />');

	res.send(links);
});

app.use((req, res) => {
	res.status(404).send('404 Not Found');
});

app.listen(port, err => {
	if (err) {
		console.log('Error', err);
		process.exit(1);
	}
	console.log('Serving ' + root + ' on port ' + port + '.');
});
