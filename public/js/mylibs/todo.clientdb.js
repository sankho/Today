var TODO = TODO || {};

TODO.clientDB = (function() {
    
    var db            = localStorage;
    var namespace     = TODO.namespace;
    var api           = {};

    api.saveCollection = function(collection) {
        db[namespace + collection] = JSON.stringify(TODO.collections[collection]);
    }

    api.getCollection = function(collection) {
        TODO.collections[collection] = db[namespace + collection] ? JSON.parse(db[namespace + collection]) : {};

        return TODO.collections[collection];
    }

    return api;

}());