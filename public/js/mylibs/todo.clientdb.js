var TODO = TODO || {};

TODO.clientDB = (function() {
    
    var db            = localStorage;
    var namespace     = TODO.namespace;

    function saveCollection(collection) {
        db[namespace + collection] = JSON.stringify(TODO.collections[collection]);
    }

    function getCollection(collection) {
        TODO.collections[collection] = db[namespace + collection] ? JSON.parse(db[namespace + collection]) : {};

        return TODO.collections[collection] ? TODO.collections[collection] : [];
    }

    /** subscribe to internal events **/
    TODO.subscribe('doc-save',function(doc,collection) {
        saveCollection(collection);
    });

    TODO.subscribe('doc-remove',function(doc,collection) {
        saveCollection(collection);
    });

    return {
        getCollection : getCollection
    };

}());