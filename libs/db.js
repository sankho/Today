 var mongoDB 		= require('mongodb').Db,
  	 Connection  	= require('mongodb').Connection,
  	 Server 		= require('mongodb').Server,
  	 sys			= require('sys');

var db = module.exports;

if (process.env.NODE_ENV !== 'production') {
	var client = new mongoDB('todo', new Server("127.0.0.1", 27017, {}));
} else {
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
		if (doc._id) {
			doc._id = new client.bson_serializer.ObjectID(doc._id);
	
			// fix this to something that returns the document; notice it's returning
			// the same doc to the callback that is sent to the save function orginally.
			// this is being collection.save doesn't return any params in the callback :(
			collection.save(doc, function() {
				client.close();
				typeof callback === 'function' ? callback(doc) : '';
			});
		} else {
			collection.insert(doc,{safe:true},function(err,result) {
				client.close();
				if (result.length === 1) {
					result = result[0];
				}
				typeof callback === 'function' ? callback(err ? err : result) : '';
			});
		}
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