var socket
  , firstConnect = true; //Check to see if this is the first connection from this session - socket.io won't allow multiple connections from one session, so we need to call 'reconnect' if we disconnect and want to connect again, rather than calling 'connect' again.

var connect = function(){
	socket = io.connect(null);
	//Parameter is for address and port - passing in 'null' will ensure that the browser's current address and port will be used
	if(firstConnect){
		//Standard socket.io server events
		socket.on('connect', function(){
			var username = $('#username').val();
			//Emit new-user event
			socket.emit('new-user', username);

			$('#status').html('Connected to server');
			$('#loggedInUser').html(username);
			//Get nickname
			socket.emit('set nickname', username);
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

function ChatCtrl($scope){
	$scope.isConnected = false;
	$scope.connection = function(connection){
		$scope.isConnected = connection;
	};
}
