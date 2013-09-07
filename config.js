//Read a json file synchronously

var fs = require("fs");
console.log("Starting");
var contents = fs.readFileSync("./files/config.json");
var config = JSON.parse(contents);
console.log("Config:", config);
console.log("Username: ", config.username);

//Execute here