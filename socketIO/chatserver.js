/*
	A simple Node.js chat server - takes connections and messages, and broadcasts messages to all connected clients
*/

var http = require('http')
  , fs = require('fs')
  , url = require('url')
  , db = require('mongojs').connect('localhost/chatdb', ['chatusers'])
  , usersCollection = db.collection('chatusers')
  , server
  , users = []
  , userAdded = true
  , returningUser = false
  , passwordMatch = false;

//User object model for database (mongodb)
function user(username, password){
	this.username = username;
	this.password = password;
	//Example JSON notation of this object: {"username" : "User Name Here", "password" : "Password Here"}
}

//Function add a user to the database
function addUser(newUser){
	usersCollection.save(newUser, function(err, savedUser){
		if(err || !savedUser){
			console.log('User: '+newUser.username + ' not saved because of error '+err);
			userAdded = false;		
		} else {
			console.log('User: '+newUser.username+ ' saved to database.');
			userAdded = true;
		}
	});
}

//Function to find a specific user from the database
function findUser(user){
	usersCollection.findOne({username: user.username}, function(err, foundUser){
		if (err || !foundUser){
			console.log("User ["+user.username+"] not found.");
		} 
		else if(user.password==foundUser.password){
			console.log("User found: "+foundUser.username);
			returningUser = true;
			passwordMatch = true;
		} else {
			console.log("User with this name already exists - password mismatch");
			passwordMatch = false;
		}
	});
}

//Function to change a user's password
function changePassword(user, newPassword){
	usersCollection.update({username: user.username}, {$set : { password: newPassword} }, {upsert:false, multi:false}, function(err){
		if(err){
			console.log("Error updating: "+err);
		}
	});
}

//Ensure that duplicate usernames are not added to the database
usersCollection.ensureIndex({username:1}, {unique: true});

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

function notFound (res){
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

	socket.on('new-user', function(name, password){
		console.log('new user initiated: '+ name);
		var newUser = new user(name, password);

		//Check to see if password is greater than 5 characters
		if(newUser.password.length <= 5){
			socket.emit('error', "Please enter a password of greater than 5 characters.");
			socket.disconnect();
		} else {
			//Add user to database
			addUser(newUser);
			findUser(newUser);
			if(userAdded){
				//Return "true" to the username-check event
				io.sockets.socket(socket.id).emit("username-check", true);
			} else if (returningUser && passwordMatch){
				io.sockets.socket(socket.id).emit("username-check", true);
				io.sockets.socket(socket.id).emit("returning-user", true);
			} else if (returningUser == true && passwordMatch == false){
				io.sockets.socket(socket.id).emit("returning-user", false);
			} else {
				//Return "false" to the username-check event
				io.sockets.socket(socket.id).emit("username-check", false);		
			}
			//TODO: Send list of users to client
			io.sockets.emit('update-user-list', users);
		}
	});

	//Set chat handle
	socket.on('set nickname', function(name){

		socket.set('nickname', name, function(){
			//Set username
			socket.send('{"success": 1}');
			//Emit 'ready' event
			socket.emit('ready');
		});
	});

	//Disconnect event
	socket.on('disconnect', function(){
		console.log("Connection " + socket.id + " terminated.");
	});

	//Force disconnect
	socket.on('user-exists', function(){
		socket.emit('error', "The username you have requested is already in use. Please choose an alternative username.");
		socket.disconnect();
	});

	//When a message is recieved, broadcast it to all connected clients
	socket.on('message', function(message){
		//Get nickname from client side
		socket.get('nickname', function(err, name){
			console.log("Received message: '"+message+"' - from client " + name+ " ("+socket.id+")");
			//relay message to all connected clients - this is a custom defined event!
			io.sockets.emit('chat', name, message);
			//emit event to clear this user's input field
			io.sockets.socket(socket.id).emit('clear');
		});
	});

	//TODO: Make this work!
	socket.on('private-message', function(message){
		io.sockets.socket[message.to].emit("private", {from: socket.id, to: message.to, msg: message.msg});
		socket.emit("private", {from: socket.id, to: message.to, msg: message.msg});
	});

	//Periodically update list of connected users -- TODO: Make this nicer (at present it resets to default option whenever list is refreshed)
	setInterval(function(){
		socket.emit('update-user-list', users);
	}, 15000);
});