// Init
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var RateLimit = require('express-rate-limit');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(new RateLimit({
  windowMs: 1*60*1000, // every 1 minute...
  max: 15*2000,        // allow each of our room's 15 computers to send 2000 messages...
  delayMs: 0           // at full speed.
}));

// Top Secret Key
var key = process.env.ROOMKEY;

// Top Secret Data
var data = {};
data[key] = {};

// for cool kids only
app.get("/"+key, function (request, response) {
  response.sendFile(__dirname + '/views/app.html');
});

// for when the client pulls
app.get("/data", function (request, response){
  response.send(data[request.query.key]);
});

// for when the client pushes
app.post("/data", function (request, response){
  var datap = request.body.data;
  for (var id in datap){
    if (typeof data[id] === "undefined"){
      data[key][id] = {};
      data[key][id].lang = datap[id].lang;
      data[key][id].time = 0;
      data[key][id].text = "";
      (function(ID){
        fs.readFile(__dirname + '/examples/example.' + datap[ID].lang, function(err, filedata){
          if (1 > data[key][ID].time){
            data[key][ID].time = 1;
            data[key][ID].text = filedata.toString();
          }
        });
      })(id);
    }
    
    if (datap[id].time > data[request.body.key][id].time){
      data[request.body.key][id].time = datap[id].time;
      data[request.body.key][id].text = datap[id].text;
    }
  }
  
  response.sendStatus(200);
});

// for the 404
app.get("/", function (request, response) {
  response.status(404);
  response.sendFile(__dirname + '/views/sorry.html');
});

app.use(function (request, response, next) {
  response.status(404);
  response.sendFile(__dirname + '/views/sorry.html');
});

// Go!
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
