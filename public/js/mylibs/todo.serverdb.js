 var TODO = TODO || {};

TODO.serverDB = (function() {
    
    var domain = '/';

    function upsertDoc(doc,collection) {
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

                TODO.collections[collection][doc._id]._id = data.doc._id;
                TODO.clientDB.saveCollection(collection);
                TODO.publish('server-upsert',[data.doc,doc]);
            }
        });

    };

    function removeDoc(_id,collection) {
        var uri = 'remove';

        $.ajax({
            url : domain + uri,
            type : 'post',
            data : {
                doc_id     : _id,
                collection : collection
            },
            success : function(data) {
                console.log('Server Response to Removal... ', data);

                TODO.publish('server-remove',[_id,collection]);
            }
        });
    }

    function sync(callback,i) {
          
        /*
        $.ajax({
            url : '/sync-items',
            type : 'post',
            data : {
                items : TODO.clientDB.getCollection('item'),
            },
            success : function(data) {
                console.log('server response to sync ', data);
                callback();
            }
        })
        //*/
    }

    function findOnServer(args,collection,callback) {
        var uri = 'find';
        
        $.ajax({
            url : domain + uri,
            type : 'post',
            data : {
                args       : args,
                collection : collection
            },
            success : function(data) {
                callback(data.doc);
            }
        });
    }

    return {
        init : function() {
            /** subscribe to internal events **/
            TODO.subscribe('doc-save', function(doc,collection) {
                upsertDoc(doc,collection);
            });
        
            TODO.subscribe('doc-remove', function(doc_id,collection) {
                removeDoc(doc_id,collection);
            });

            TODO.subscribe('find-on-server', findOnServer)
        },
        sync : sync
    };

}());