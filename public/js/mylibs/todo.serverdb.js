var TODO = TODO || {};

TODO.serverDB = (function() {
    
    var api    = {};
    var domain = '/';

    api.upsertDoc = function(doc,collection) {
        var uri = 'upsert';

        $.ajax({
            url : domain + uri,
            type : 'post',
            data : {
                doc        : JSON.stringify(doc),
                collection : collection
            },
            success : function(data) {
                console.log('Server Response to Upsertion... ', data);
                // need to take this response and update row / new ID if needed.
            }
        });

    };

    api.removeDoc = function(_id) {
        var uri = 'remove';
    };

    // ???
    // how in the world will this work...?
    api.syncLocal = function() {
        var uri = 'sync';
    }

    /** subscribe to internal events **/
    TODO.subscribe('doc-save',function(doc,collection) {
        api.upsertDoc(doc,collection);
    });

    TODO.subscribe('doc-remove',function(doc_id,collection) {
        //saveCollection(collection);
    });

    return api;

}());