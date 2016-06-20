
// Variables for the Recording-Server
var express = require('express');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');

var port = 80;
var outFile = 'Concert.wav';
var app = express();

app.set('views', __dirname + '/public/jade');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'))


// URI handlers
app.get('/', function(req, res){
  res.render('index');
});

app.listen(port);

console.log('Recording-Sever listining on port: ' + port);

binaryServer = BinaryServer({port: 9001});

// Handling a client
binaryServer.on('connection', function(client) {

  // Log information
  console.log('A new venue has connected.');

  // Creating a new FileWriter to save the concert to disk
  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  // Store the client socket stream as a wav file
  client.on('stream', function(stream, meta) {
    console.log('A venue is ready to record...');
    stream.pipe(fileWriter);

    // End the client socket stream
    stream.on('end', function() {
      fileWriter.end();
      console.log('Recording saved!');
    });
  });

  // A client disconnected
  client.on("close", function () {
      console.log("A venue has disconnected.");
  });
});