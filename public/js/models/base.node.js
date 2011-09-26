var baseModel = module.exports;

var Db 			= require('mongodb').Db,
  	Connection  = require('mongodb').Connection,
  	Server 		= require('mongodb').Server,
  	sys			= require('sys');

if (process.env.NODE_ENV !== 'production') {
	var client = new Db('todo', new Server("127.0.0.1", 27017, {}));	
} else {

	// mongo lab??
	var client = new Db('todo', new Server("dbh43.mongolab.com", 27437, {
		user : 'sankho',
		password : 't0d0 t0d@y'
	}));

	client.open(function(err,client) {
		console.log(err);
	});
}

var db = (function() {

	var api = {};

	api.getById = function(id,collection,callback) {
		try {
		client.open(function(err, p_client) {
		    client.collection(collection, function (err, collection) {
				collection.findOne({
					_id : new client.bson_serializer.ObjectID(id)
				}, function(err, result) {
					client.close();
  					typeof callback === 'function' ? callback(err ? err : result) : '';
    			});
    		});
    	});
		} catch(e) {}
	}

	api.find = function(args,sort,_collection,callback) {
		try {
		client.open(function(err, p_client) {
		    client.collection(_collection, function (err, collection) {
				collection.find(args,sort,function(err, result) {
					if (!err) {
						var results = [];
                    	result.each(function(err, item) {
                    	    if(item != null) {//null signifies end of iterator
                    	    	results.push(item);
                    	    } else {                	
								client.close();
  								typeof callback === 'function' ? callback(results) : '';
                    	    }
                    	});
                	}
    			});
    		});
    	});
		} catch(e) {}
	}

	api.getAll = function(collection, callback) {
		try {
		client.open(function(err, p_client) {
		    client.collection(collection, function (err, collection) {
				collection.find().toArray(function(err, results) {
					client.close();
  					typeof callback === 'function' ? callback(err ? err : result) : '';
    			});
    		});
    	});
		} catch(e) {}
	}

	api.save = function(doc,collection,callback) {
		try {
		client.open(function(err, p_client) {
		    client.collection(collection, function (err, collection) {
    	    	collection.save(doc, function(err, result) {
  					client.close();
  					typeof callback === 'function' ? callback(err ? err : doc) : '';
		    	});
			});
		});
		} catch(e) {}
	}

	api.remove = function(doc,collection,callback) {
		try {
		client.open(function(err, p_client) {
		    client.collection(collection, function (err, collection) {
				collection.findAndModify(doc, [], {}, {remove:true}, callback);
			});
		});
		} catch(e) {}
	}

	return api;

}());

baseModel.model = function() {
	
	var self = this;

	this.getById = function(id,callback) {
		db.getById(id,this.collection,function(result) {
			callback(result);
		});
	}

	this.save = function(callback) {
		db.save(this.doc,this.collection,function(result) {
			callback(result);
		});
	}

	this.remove = function(callback) {
		if (this.doc && this.doc._id) {
			db.remove(this.doc,this.collection,callback);
		}
	}

	this.find = function(args,sort,callback) {
		if (typeof sort === 'function') {
			callback = sort;
			sort = {};
		}
		db.find(args,sort,this.collection,function(result) {
			callback(result);
		});
	}

	this.filterId = function(id) {
		if (id && typeof id === 'string') {
			id = new client.bson_serializer.ObjectID(id);
		}
		return id;
	}

}



                    	        //sys.puts("created at " + new Date(item._id.generationTime) + "\n");