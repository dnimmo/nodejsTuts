var http = require('http');
var fs = require('fs');
console.log("Starting");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var express = require("express");

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
	var users = {"1": {"username": "dnimmo", "name": "David Nimmo", "twitter": "k_fistman"},"2": {"username": "jonnymustcreate", "name": "Jonny Hamilton", "twitter": "jonnymustcreate" }}
	var user = users[request.params.id];
	if (user){
		response.send("<a href='http://twitter.com/" + user.twitter + "'>Follow "+ user.name + " on Twitter</a>");
	}
	else{
		response.send("Sorry! No matching user", 404);
	}
})


app.listen(port, host);