var http = require('http');
var fs = require('fs');
var express = require("express");
var mongo = require('mongodb');
console.log("Starting");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var dbhost = "127.0.0.1";
var dbport = mongo.Connection.DEFAULT_PORT;

//Set up as express app - no longer inherits from http.Server
var app = express();
app.use(app.router)
//Set up location for static files
app.use(express.static(__dirname + "/public"));
app.get("/", function(request, response){
	response.send("Hello");
});

//Add URL params
app.get("/hello/:text", function(request, response){
	request.params.text;
	response.send("Hello "+ request.params.text);
});

app.get("/user/:id", function(request, response){
	
	getUser(request.params.id, function(user){
		if (!user){
			response.send("Sorry! No matching user", 404);
		} else {
			response.send("<a href='http://twitter.com/" + user.twitter + "'>Follow "+ user.name + " on Twitter</a>");
		}
	});
})

app.listen(port, host);

function getUser(id, callback){
	var db = new mongo.Db("nodejs-introduction", new mongo.Server(dbhost, dbport, {}));
	db.open(function(error){
		console.log("We are connected! " +  dbhost+":"+dbport);

		db.collection("user", function(error, collection){
			console.log("We have the collection");
			collection.find({"id":id.toString()}, function(error, cursor){
				cursor.toArray(function(error, users){
					if (users.length == 0){
						callback(false);
					} else {
						callback(users[0]);
					}
				});
			});
		});
	});
}