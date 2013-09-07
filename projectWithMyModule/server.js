var github = require('dnimmo-github-test');
github.getRepos("dnimmo", function(repos){
	console.log("dnimmo's repos: ", repos)
});