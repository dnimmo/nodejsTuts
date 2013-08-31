var socket
  , firstConnect = true; //Check to see if this is the first connection from this session - socket.io won't allow multiple connections from one session, so we need to call 'reconnect' if we disconnect and want to connect again, rather than calling 'connect' again.

var connect = function(){
	socket = io.connect(null);
	//Parameter is for address and port - passing in 'null' will ensure that the browser's current address and port will be used
	if(firstConnect){
		//Standard socket.io server events
		socket.on('connect', function(){
			var tempUsername = $('#username').val()
			  , username;

			socket.emit('new-user', tempUsername);
			//Check to see if username is available - Callback for my custom 'username-check' event
			socket.on('username-check', function(status){
				if(status == true){
					username = tempUsername;

					$('#status').html('Connected to server');
					$('#loggedInUser').html(username);
					//Get nickname
					socket.emit('set nickname', username);
					//crazy jQuery to make elements visible - fix with Angular!
					toggleActive('.isLoggedIn', 'inactive', 'active');
					toggleActive('.usernameLabel', 'active', 'inactive');
					toggleActive('.messageLabel', 'inactive', 'active');
					toggleActive('#username', 'active', 'inactive');
					toggleActive('#message', 'inactive', 'active');
					toggleActive('#connect', 'active', 'inactive');
					toggleActive('#send', 'inactive', 'active');
					toggleActive('#disconnect', 'inactive', 'active');
					toggleActive('.isLoggedIn', 'inactive', 'active');
				} else {
					$('#status').html('Sorry, the username you requested is taken');
					socket.emit('disconnecting');			
				}
			});
		});

		socket.on('disconnect', function(){
			$('#status').html('Disconnected from server');
		});
		socket.on('reconnecting', function(nextRetry){
			$('#status').html('Attempting to reconnect to server in '+nextRetry+' milliseconds');

		});
		socket.on('reconnect_failed', function(){
			$('#status').html('Reconnection failed');
		});

		//Callback for my custom defined 'chat' event
		socket.on('chat', function(client, message){
			$('#messageHistory').append('<strong>'+client+' said:</strong> <br/>'+message+'<br/>');
			$('#message').val('');
		});

		firstConnect = false;

	} else {
		//If it's not the session's first connection, just reconnect instead of trying to set up a new connection
		socket.socket.reconnect();
	};
}

var disconnect = function(){
	socket.disconnect();
}

var send = function(){
	socket.send($('#message').val());
}

//jQuery function to toggle active classes - to be changed for Angular at some point
var toggleActive = function(element, class1, class2){
	$(element).removeClass(class1);
	$(element).addClass(class2);
}