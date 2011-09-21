var TODO = TODO || {};

TODO.serverDB = (function() {
    
    var api    = {};
    var domain = 'http://localhost:8080/';

    api.upsertRecord = function(record) {
        var uri = 'upsert';

    };

    api.deleteRecord = function(_id) {
        var uri = 'delete';
    };

    // ???
    // how in the world will this work...?
    api.syncLocal = function() {
        var uri = 'sync';
    }

    return api;

}());