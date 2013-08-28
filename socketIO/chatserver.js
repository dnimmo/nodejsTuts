/*
	A simple Node.js chat server - takes connections and messages, and broadcasts messages to all connected clients
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

		//Serve HTML files 
		case '/':
			fs.readFile(__dirname + '/chatclient.html', function(err, data){
				if(err){
					return notFound(res);
				}
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
		break;

		case '/chatclient.js':
			fs.readFile(__dirname + '/chatclient.js', function(err, data){
				if(err){
					return notFound(res);
				}
				res.writeHead(200, {'Content-Type': 'text/javascript'})
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

server.listen(8000);
console.log('Server running at http://127.0.0.1:8000/')

//Declared down here so that the server address and port only has to be declared in one place
var io = require('socket.io').listen(server);

//on connection - this acts on all sockets ('connection' is the event name)
io.sockets.on('connection', function(socket){
	console.log("Connection " + socket.id + " accepted.");

	//Set chat handle
	socket.on('set nickname', function(name){

		//Check current usernames
		var clients = io.sockets.clients();
		clients.forEach(function(client){
			console.log('Username = '+client.nickname);
		});
		socket.set('nickname', name, function(){
			//Set username
			socket.send('{"success": 1}');
			//Emit 'ready' event
			socket.emit('ready');
		});
	});

	socket.on('new-user', function(username){
		console.log('New user connected: '+username)
	});

	//Disconnect event
	socket.on('disconnect', function(){
		console.log("Connection " + socket.id + " terminated.");
	});

	//When a message is recieved, broadcast it to all connected clients
	socket.on('message', function(message){
		//Get nickname from client side
		socket.get('nickname', function(err, name){
			console.log("Received message: "+message+" - from client " + name+ " ("+socket.id+")");
			//relay message to all connected clients - this is a custom defined event!
			io.sockets.emit('chat', name, message);
		});
	});
});