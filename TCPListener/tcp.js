var net = require('net');
var client_count=0;

//Create server and listen for input, then echo input back
var server = net.createServer(function(socket){ //'Connection' listener

	//Check input
	socket.on('data', function(data){
		var data = String(data).trim();
		console.log('Command received: '+data+"\n")

		//Disconnect on 'disconnect' command
		if (data === "disconnect") {
	        socket.write("Disconnecting. Thanks for stopping by!\n");
	     	socket.close();
	    }

	    //Give server details on 'server address' command
	    else if (data === "server address"){
	    	address = server.address();
			console.log("Server address request received");
	    	socket.write("IP: "+address.address+"\nPort: "+address.port+"\nFamily: "+address.family+"\n");
	    }

	    //Add numbers on 'add(x,y)' command
        else if (data.match(/add\(/i)) {
            var vals = data.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1+val2) + '\n');
            else notNumber(socket);
        }

        //Subtract numbers on 'subtract(x,y)' command
        else if (data.match(/subtract\(/i)) {
            var vals = data.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1-val2) + '\n');
            else notNumber(socket);
        }

        //Multiply numbers on 'multiply(x,y)' command
        else if (data.match(/multiply\(/i)) {
            var vals = data.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1*val2) + '\n');
            else notNumber(socket);
        }

        //Divide numbers on 'divide(x,y)' command
        else if (data.match(/divide\(/i)) {
            var vals = data.split(/,|\(|\)/);
            var val1 = parseInt(vals[1]);
            var val2 = parseInt(vals[2]);
            if(testInts(val1,val2))
                socket.write('Result: ' + (val1/val2) + '\n');
            else notNumber(socket);
        } 
        else {
			socket.write("Unknown command: " + data + "\n");
        }
	});
	//Test to see if both inputs are numbers
	var testInts = function(val1, val2){
		if(isNaN(val1) || isNaN(val2)){
			return false;
		} else {
			return true;
		}
	};
	//Print error if not a number
	var notNumber = function(socket){
		socket.write("Error: At least one of those wasn't a number - did you seperate them with a comma?\n");
	};

	client_count++;
	console.log("Client "+ client_count + " connected");
 	socket.write("Connected to server.\r\n");
});

//'Listening' listener
server.listen(8080, '127.0.0.1'); 

