var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var ROOT_DIR = "./html";
var options = {
  host: '127.0.0.1',
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt')
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user,pass) {
  return((user === 'cs360')&&(pass === 'test'));
});

app.get('/', function(req, res){
  console.log("Got request");
  res.send('Get Index');
});

//get city api
app.get('/getcity', function (req, res) {
  console.log("In getcity route");
  var query = req.query.q;
  //open file with cities
  fs.readFile(ROOT_DIR + "/utahCities.txt", function(err, data) {
    if(err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    } 
    //search for requested city
    var temp = data.toString();
    var citiesArray = temp.split("\n");
    var foundCities = [];
    for(var index in citiesArray) {
      if(citiesArray[index].indexOf(query) != -1) {
        var temp = {city:citiesArray[index]};
        foundCities.push(temp);
      }
    }
    res.writeHead(200,{"Access-Control-Allow-Origin":"*"});
    res.end(JSON.stringify(foundCities));
  });
});

//comment api
app.get('/comment', function (req, res) {
  console.log("In GET comment");
  var MongoClient = require("mongodb").MongoClient;
  MongoClient.connect("mongodb://localhost/weather",function(err,db) {
    if(err) throw err;
    db.collection("comments",function(err,comments) {
      if(err) throw err;
      comments.find(function(err,items) {
        items.toArray(function(err, itemArr){
          console.log("Document array: ");
          console.log(itemArr);
          res.writeHead(200,{"Access-Control-Allow-Origin":"*"});
          res.end(JSON.stringify(itemArr));
        });
      });
    });
  });
});

app.post('/comment',auth, function (req, res) {
  console.log("In POST comment route");
  var jsonData = req.body;
  console.log(jsonData);
//  var reqObj = JSON.parse(jsonData);  
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost/weather", function(err, db) {
    if(err) throw err;
    db.collection('comments').insert(jsonData,function(err, records) {
       console.log("Record added as "+records[0]._id);
    });
  });
  res.json({status:"success"});
//  res.writeHead(200,{"Access-Control-Allow-Origin":"*"});
//  res.end();
});

app.use('/', express.static('./html', {maxAge: 60*60*1000}));

