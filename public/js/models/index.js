var TODO = TODO || {};

if (typeof window === 'undefined' && typeof global !== 'undefined') {
    TODO = module.exports;
    TODO.baseModel = require('../../../libs/baseModel.js').model;
}

TODO.item = function() {
    
    var self = this;

    this.doc = {
        _id     : '',
        list_id : '',
        text    : '',
        order   : 0,
        done    : false,
        save    : false
    };

    this.collection = 'item';

};
TODO.item.prototype = new TODO.baseModel();

TODO.list = function() {

    var self = this;

    this.doc = {
        _id  : '',
        name : ''
    };

    this.collection = 'list';

    this.getItemsByName = function(name,callback) {
        self.find({
            name : name
        }, function(doc) {
            self.doc = doc[0];

            new TODO.item().find({
                'list_id' : self.doc._id.toString()     // WOAH toString!
            }, function(items) {
                callback(items,self.doc);
            });
        });
    };

    this.createByName = function(name,callback) {
        self.find({
            name : name
        }, function(doc) {
            if (doc.length === 0) {
                self.doc.name = name;
                self.save(function(doc) {
                    callback(doc);
                });
            } else {
                callback(false);
            }
        });
    }

};
TODO.list.prototype = new TODO.baseModel();