var socket
  , firstConnect = true //Check to see if this is the first connection from this session - socket.io won't allow multiple connections from one session, so we need to call 'reconnect' if we disconnect and want to connect again, rather than calling 'connect' again.
  , username;

var connect = function(){
	socket = io.connect(null);
	//Parameter is for address and port - passing in 'null' will ensure that the browser's current address and port will be used
	if(firstConnect){
		//Standard socket.io server events
		socket.on('connect', function(){
			var tempUsername = $('#username').val();

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
					toggleActive('.username', 'active', 'inactive');
					toggleActive('#connect', 'active', 'inactive');
					toggleActive('#disconnect', 'inactive', 'active');
					toggleActive('#messaging', 'inactive', 'active');
					//toggleActive('#privateMessaging', 'inactive', 'active');
					$('#errorMessage').html('');
				} else {
					socket.emit('user-exists');
				}
			});
		});

		socket.on('disconnect', function(){
			$('#status').html('Disconnected from server');
			//crazy jQuery to make elements visible - fix with Angular!
			toggleActive('.username', 'inactive', 'active');
			toggleActive('#connect', 'inactive', 'active');
			toggleActive('#disconnect', 'active', 'inactive');
			toggleActive('#messaging', 'active', 'inactive');
			//toggleActive('#privateMessaging', 'active', 'inactive');
		});
		socket.on('reconnecting', function(nextRetry){
			$('#status').html('Attempting to reconnect to server in '+nextRetry+' milliseconds');

		});
		socket.on('reconnect_failed', function(){
			$('#status').html('Reconnection failed');
		});

		socket.on('chat', function(client, message){
			$('#messageHistory').append('<strong>'+client+' said:</strong> <br/>'+message+'<br/>');
		});

		socket.on('private-message', function(message){
			$('#messageHistory').append('<strong>[PRIVATE MESSAGE] '+message.from+' said:</strong> <br/>'+message.msg+'<br/>');
		});

		socket.on('error', function(errorMessage){
			$('#errorMessage').html(errorMessage);
		});

		socket.on('clear', function(){
			$('#message').val('');
		});

		socket.on('update-user-list', function(users){
			var optionsValues = '<select id="userSelect"><option>Select A User</option>';
			for(i=0; i < users.length; i++){
				optionsValues+="<option value='"+users[i]+"'>"+users[i]+"</option>";
			}
			optionsValues+='</select>';
			var options=$('#userSelect');
			options.replaceWith(optionsValues);
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

var sendPrivateMessage = function(){
	socket.emit("private-message", {msg: $('#message').val(), to: $('#userSelect').val()});
}

//jQuery function to toggle active classes - to be changed for Angular at some point
var toggleActive = function(element, class1, class2){
	$(element).removeClass(class1);
	$(element).addClass(class2);
}