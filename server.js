
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});







// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/cache.manifest', function(req,res) {
  res.header('Content-Type', 'text/cache-manifest');
  res.header('Cache-Control', 'no-cache');
  res.header('Expires', 'Thu, 01 Dec 1994 16:00:00 GMT'); // aka it expired already

  res.render('appcache', {
    layout : false
  });
});

app.post('/upsert', function(req,res) {
  
  res.json({
    whatup : 'nigga'
  });

});









app.listen(app.settings.env === 'production' ? 12033 : 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);