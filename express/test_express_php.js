var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');

var express = require('express');
var app = express();

// must specify options hash even if no options provided!
var phpExpress = require('php-express')({
  
  // assumes php is in your PATH
  binPath: 'php'
});

// set view engine to php-express
app.set('views', '../');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');

// routing all .php file to php-express
app.all(/.+\.php$/, phpExpress.router);
 
var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('PHPExpress app listening at http://%s:%s', host, port);
});

/*
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
  };
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.get('/', function(req, res){
  console.log("Got request");
  res.send('Get Index');
});
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
*/


