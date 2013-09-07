//Load the https module
var https = require("https");

//Gets data on the GitHub repos of the username that is passed in
function getRepos(username, callback){

	var options = {
		host: 'api.github.com',
		path: '/users/'+username+'/repos',
		method: 'GET',
		headers: {'user-agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
	};

	var request = https.request(options, function(response){
		var body = '';
		response.on("data", function(chunk){
			body += chunk.toString('utf8');
		});
		response.on("end", function(){
			var repos = [];
			var json = JSON.parse(body);
			json.forEach(function(repo){
				repos.push({
					name: repo.name,
					description: repo.description
				});
			});
			callback(repos);
		});
	});
	request.end();
}

module.exports.getRepos = getRepos;