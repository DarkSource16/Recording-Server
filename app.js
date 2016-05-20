// Variables for the Recording-Server
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

var wav = require('wav');
var concertFile = 'demo.wav'


// URI handlers
app.get('/', function(req, res){
 res.sendFile(__dirname + '/index.html');
});


// Handling a client
io.on('connection', function (socket) {
	// Log information
	console.log('A new client has connected.');

	// Creating a new FileWriter to save the concert to disk
	var fileWriter = new wav.FileWriter(concertFile, {
    	channels: 1,
    	sampleRate: 48000,
    	bitDepth: 16
  	});

  	// Store the client socket stream as a wav file
  	socket.on('stream', function(data) {
    	console.log('A client is sending a new stream.');
    	console.log('Recording...');
    	//data.pipe(fileWriter);
  	});

  	// End the client socket stream
	socket.on('end', function() {
  		fileWriter.end();
  		console.log('Recording saved!');
	});

	// A client disconnected
	socket.on("disconnect", function () {
        console.log("A client has disconnected.");
    });
});


// Starting the server
server.listen(port, function(){
 console.log('Recording-Sever listining on port: ' + port);
});