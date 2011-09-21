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

};
TODO.list.prototype = new TODO.baseModel();