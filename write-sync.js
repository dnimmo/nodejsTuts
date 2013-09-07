var fs=require("fs");
console.log("Starting");
fs.writeFile("./files/write-sync.txt", "Hello synchronous world!", function(error){
	console.log("Written file");
});
console.log("Finished");