//Read file synchronously

var fs = require("fs");
console.log("Starting");
var contents = fs.readFileSync("./files/sample.txt");
console.log("Contents: " + contents);
console.log('CONTINUE')