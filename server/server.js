var http = require('http');
var fs = require('fs');
console.log("Starting");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var server = http.createServer(function(request, response){
	console.log("Received request: " + request.url);
	fs.readFile("./public" + request.url, function(error, data){
		//Give 404 message if unable to reach request
		if (error){
			response.writeHead(404, {"Content-type":"text/html"});
			response.end("404: Page not found");
		} else {
			response.writeHead(200, {"Content-type":"text/html"});
			response.end(data);
		}
	});
});
server.listen(port, host, function(){
	console.log("Listening "+ host + ":" + port);
});
//If port changes in config, restart server on new port (watches config.json for changes)
fs.watchFile("config.json", function(){
	config = JSON.parse(fs.readFileSync("config.json"));
	server.close();
	server.listen(port, host, function(){
		console.log("Now Listening "+ host + ":" + port);
	});
});