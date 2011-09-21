var TODO = TODO || {};

TODO.baseModel = function() {

    var self = this;

    var namespace = TODO.namespace;

    self.save = function() {
        if (this.doc) {

            var collection = TODO.clientDB.getCollection(this.collection);

            if (!this.doc._id) {
                // might want to find something other than sha256. shorter, even.
                this.doc._id = 'new_' + Sha256.hash(Math.floor(Math.random(1)*999));
                // probably should check if this ID exists elsewhere first, meh
            }

            TODO.collections[this.collection][this.doc._id] = this.doc;
            TODO.clientDB.saveCollection(this.collection);
            TODO.serverDB.upsertDoc(this.doc);

            TODO.publish('item-saved',[this.doc]);
        }
    }

    self.remove = function() {
        delete TODO.collections[this.collection][this.doc._id];
        TODO.clientDB.saveCollection(this.collection);

        TODO.publish('item-remove',[this.doc._id]);
    }

    self.getById = function(_id) {
        var collection = TODO.collections[this.collection];
        for (var item in collection) {
            if (item === _id) {
                this.doc = collection[item];
                return this;
            }
        }
    }

};