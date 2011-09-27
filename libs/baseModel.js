var db 		  = require('./db.js');
var baseModel = module.exports;

baseModel.model = function() {
	
	var self = this;

	this.getById = function(id,callback) {
		db.getById(id,this.collection,callback);
	}

	this.save = function(callback) {
		db.save(this.doc,this.collection,callback);
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

}