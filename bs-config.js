var express = require('express')
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/app/" + "index.html"); 
})

app.get('/addbook', function(req, res)  {
  res.sendFile(__dirname + "/app/" + "addbook.html");
})

app.get('/mybooks', function(req, res)  {
  res.sendFile(__dirname + "/app/" + "mybooks.html");
})

app.get('/requests', function(req, res)  {
  res.sendFile(__dirname + "/app/" + "requests.html");
})

app.get('/status', function(req, res)  {
  res.sendFile(__dirname + "/app/" + "status.html");
})

app.get('/about', function(req, res)  {
  res.sendFile(__dirname + "/app/" + "about.html");
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
