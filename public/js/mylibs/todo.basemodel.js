var TODO = TODO || {};

TODO.baseModel = function() {

    var self = this;

    var namespace = TODO.namespace;

    this.save = function() {
        if (this.doc) {
            var collection = TODO.clientDB.getCollection(this.collection);

            /** this needs some major love. when you're feeling smarter that is. */
            if (!this.doc._id) {
                // might want to find something other than sha256. shorter, even.
                //this.doc._id = 'new_' + Sha256.hash(Math.floor(Math.random()*999));
                this.doc._id = 'new_' + Math.floor(Math.random()*999);
                // probably should check if this ID exists elsewhere first, meh
            }

            TODO.collections[this.collection][this.doc._id] = this.doc;

            TODO.publish('doc-save',[this.doc,this.collection]);
        }
    }

    this.remove = function() {
        delete TODO.collections[this.collection][this.doc._id];
        TODO.publish('doc-remove',[this.doc._id,this.collection]);
    }

    this.getById = function(_id) {
        var collection = TODO.collections[this.collection];
        this.doc = collection[_id];
        return this;
    }

    // nice programming, douche
    this.find = function(args,callback) {
        var collection = TODO.clientDB.getCollection(this.collection);
        var items      = [];
        
        for (item in collection) {
            var addItem = true;
            var item    = collection[item];
            for (arg in args) {
                if (item[arg] !== args[arg]) {
                    addItem = false;
                }
            }
            if (addItem) {
                items.push(item);
            }
        }
        callback(items);
    }

};