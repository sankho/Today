var TODO = TODO || {};

TODO.serverDB = (function() {
    
    var api    = {};
    var domain = '/';

    api.upsertDoc = function(doc) {
        var uri = 'upsert';

        $.ajax({
            url : domain + uri,
            type : 'post',
            data : {
                doc : JSON.stringify(doc)
            },
            success : function(data) {
                console.log('Server Response to Upsertion... ', data);
            }
        });

    };

    api.deleteDoc = function(_id) {
        var uri = 'delete';
    };

    // ???
    // how in the world will this work...?
    api.syncLocal = function() {
        var uri = 'sync';
    }

    /** subscribe to internal events **/
    TODO.subscribe('doc-save',function(doc,collection) {
        //saveCollection(collection);
    });

    TODO.subscribe('doc-remove',function(doc,collection) {
        //saveCollection(collection);
    });

    return api;

}());