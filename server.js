
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



var models = require('./public/js/models');

// Routes

app.get('/', function(req, res){
  res.render('index', {
    key: 'val'
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

  var doc = JSON.parse(req.param('doc'));

  if (doc._id.indexOf('new') !== -1) {
    doc._id = undefined;
  }

  var collection = req.param('collection');

  var thing = new models[collection]();

  thing.doc = doc;
  thing.save(function(doc) {
    res.json({
      doc : doc
    });
  });

});

app.post('/find', function(req,res) {

  var args = req.param('args');
  delete args['size'];  // wtf is this shit about? what if I want a key to be size?? where is this coming from?

  var collection = req.param('collection');

  var thing = new models[collection]();
  thing.find(args,function(doc) {
    res.json({
      doc : doc
    });
  });

});


app.post('/remove', function(req,res) {

  var thing = new models.item();
  var id = req.param('doc_id');

  thing.getById(id,function(doc) {
    thing.doc = doc;

    thing.remove(function() {
      res.json({
        success : 'true'
      });
    });
  });

});

app.get('/get-items/:name', function(req,res) {
  
  var list = new models.list().getItemsByName(req.params.name, function(items,doc) {
    res.json({
      list_id : doc._id,
      items   : items
    });
  });

});

app.post('/create-list', function(req,res) {
  
  var name = req.param('name');
  new models.list().createByName(name,function(doc) {
    var success = doc !== false;
    res.json({
      success : success
    });
  });

});

app.listen(app.settings.env === 'production' ? 12033 : 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);