var mongo = require('mongodb');
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}));
db.open(function(error){
	console.log("We are connected! " +  host+":"+port);

	db.collection("user", function(error, collection){
		console.log("We have the collection");

		collection.insert({
			id: "1",
			name: "David Nimmo",
			twitter: "k_fistman",
			email: "dnimmo@gmail.com"
		}, function(){
			console.log("Successfully inserted David");
		});

		collection.insert({
			id: "2",
			name: "Juri Cat",
			twitter: "floppycat",
			email: "floppycat@gmail.com"
		}, function(){
			console.log("Successfully inserted Juri");
		});

	});
});