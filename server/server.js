var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));

app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function ( req, res ) {
  res.sendfile(path.join(__dirname, '../client/public/index.html'));
});

require('./routes/post')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
