var github = require("./github.js")

github.getRepos("dnimmo", function(repos){
	console.log("dnimmo's repos ", repos);
});