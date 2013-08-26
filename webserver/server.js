/*
	A simple Node.js web server - serves an index page, a 404 page and a twitter feed (on /twitter)
*/

var http = require('http')
  , fs = require('fs')
  , url = require('url')
  , server;

//Create server object
server = http.createServer(function(req, res){
	//Parse pathname as url
	var path = url.parse(req.url).pathname;

	//Set up routes
	switch(path){
		case '/test':
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write('It works!\n');
			res.end();
		break;

		//Serve HTML files 
		case '/':
			fs.readFile(__dirname + '/index.html', function(err, data){
				if(err){
					return notFound(res);
				}
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
		break;

		case '/twitter':
			fs.readFile(__dirname + '/twitter.html', function(err, data){
				if(err){
					return notFound(res);
				}
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
		break;

	default: 
		notFound(res);
	}
});

var notFound = function(res){
	res.writeHead(404);
	res.write('404\n');
	res.end();
};

server.listen(8080);