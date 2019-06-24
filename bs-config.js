var express = require('express')
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/app/" + "index.html"); 
})

app.get('/addbook', function(req, res)  {
  res.sendFile(__dirname + "/app/" + "addbook.html");
})

module.exports = {
	"server" : {
		"baseDir" : ["./app","./build/contracts"],
		"routes" : {
			"/node_modules" : "node_modules"
		},
		middleware : {
			1: app,
		},
	},
	port:3001,
};