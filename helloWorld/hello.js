/*

	A simple "Hello" program. Takes a name, says hello. Simple.

*/

var rl = require('readline');
var interface = rl.createInterface(process.stdin, process.stdout, null);

interface.question("What's your name? ", function(answer){
	console.log("Hello, " + answer + "!");
	interface.close();
	process.stdin.destroy();
});
