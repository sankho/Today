 var mongoDB 		= require('mongodb').Db,
  	 Connection  	= require('mongodb').Connection,
  	 Server 		= require('mongodb').Server,
  	 sys			= require('sys');

var db = module.exports;

if (process.env.NODE_ENV === 'development') {
	var client = new mongoDB('todo', new Server("127.0.0.1", 27017, {}));
} else if (process.env.NODE_ENV === 'production') {
	var client = new mongoDB('todo', new Server("dbh43.mongolab.com", 27437));
}

function openCollection(collection,callback) {
	client.open(function(err) {
		if (process.env.NODE_ENV === 'production') {
			client.authenticate("sankho", "t0d0 t0d@y", makeQuery);
		} else {
			makeQuery(err);
		}

		function makeQuery(err) {
			client.collection(collection,callback);
		}
	});
}

db.getById = function(id,collection,callback) {
	openCollection(collection, function (err, collection) {
		collection.findOne({
			_id : new client.bson_serializer.ObjectID(id)
		}, function(err, result) {
			client.close();
			typeof callback === 'function' ? callback(err ? err : result) : '';
		});
	});
}

db.find = function(args,sort,collection,callback) {
	openCollection(collection, function (err, collection) {
	 	collection.find(args,sort).toArray(function(err, result) {
			client.close();
			typeof callback === 'function' ? callback(err ? err : result) : '';
		});
	});
}

db.save = function(doc,collection,callback) {
	openCollection(collection, function (err, collection) {
		var criteria = {
			_id : new client.bson_serializer.ObjectID(doc._id)
		};
		delete doc['_id'];
		collection.update(criteria, {$set: doc}, {safe:true,upsert:true}, function(err, result) {
			console.log('trying to save... ', doc, err);
			client.close();
			typeof callback === 'function' ? callback(err ? err : result) : '';
		});
	});
}

db.remove = function(doc,collection,callback) {
	openCollection(collection, function (err, collection) {
		collection.findAndModify(doc, [], {}, {remove:true}, function() {
			client.close();
			callback();
		});
	});
}