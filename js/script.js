/* Author: 

*/

(function($,undefined) {
    
    if (typeof window.localStorage === 'undefined') {
        return alert('Get a better browser');
    }
        
    var that = $('#today');
    var form = that.find('form');
    var list = that.find('ol');
    
    var db   = localStorage['today'];
    if (db && db.length > 0) {
        db = JSON.parse(db);
        writeList();
    } else {
        db = [];
    }
    
    function saveDB() {
        localStorage['today'] = JSON.stringify(db);
    }
    
    function writeList() {
        list.empty();
        
        var done = [];
        var todo = [];
        
        for(var i=0; i<db.length; i++) {
            var item = db[i];
            if (item.done) {
                done.push(item);
            } else {
                todo.push(item);
            }
        }
        
        for(var i=0; i<done.length; i++) {
            writeListItem(done[i]);
        }

        for(var i=0; i<todo.length; i++) {
            writeListItem(todo[i]);
        }

    }
    
    function writeListItem(todo) {
        var item = $('<li></li>');
        item.append('<p>' + todo.text + '</p>');
        
        var size = list.find('li').length;
        
        var done = [
            '<a href="#" class="done" rel="',
            size,
            '">done</a>',
        ];
        done = done.join('');
        
        item.append(done);
        
        if (todo.done) {
            item.addClass('done');
        }
        
        item.append('<a href="#" class="delete" rel="' + size + '">delete</a>');
        list.prepend(item);
    }
    
    function saveListItem(todo) {
        db.push(todo);
        saveDB();
    }
    
    function handleForm(e) {
        e.preventDefault();
        var what = $('#what').val();
        
        if (what.length > 0) {
            var todo = { text : what, done: false };
            writeListItem(todo);
            saveListItem(todo);
            form[0].reset();
        } else {
            alert('What was that?');
        }
    }
    
    function markAsDone(e) {
        e.preventDefault();
        var that   = $(this);
        var parent = that.parent();
        parent.toggleClass('done');
        db[parseInt(that.attr('rel'),10)].done = parent.hasClass('done');
        saveDB();
    }
    
    function deleteItem(e) {
        e.preventDefault();
        var that  = $(this);
        var li    = that.parent();
        if (li.hasClass('done')) {
            var index = that.attr('rel');
            db.splice(index,1);
            saveDB();
            writeList();
        }
    }
    
    /** EVENT BINDINGS **/
    form.submit(handleForm);
    list.find('li a.done').live('click', markAsDone);
    list.find('li a.delete').live('click', deleteItem);
    
})(jQuery);