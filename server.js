var express = require('express');

app = exports.module = express.createServer();

app.configure('development', function(){
  app.set('connstring', 'mongodb://localhost/media-stream-dev');
  app.set('port', 9001);
  app.set('mediaroot', '/data/media_dev/');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.set('port', 3001);
  app.set('connstring', 'mongodb://localhost/media-stream');
  app.set('mediaroot', '/data/media/');
  app.use(express.errorHandler()); 
});

require('./controllers/media');
require('./controllers/dashboard');

if (!module.parent) {
  app.listen(app.set('port'));
}