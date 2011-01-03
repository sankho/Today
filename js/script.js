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
        for(var i=0; i<db.length; i++) {
            writeListItem(db[i]);
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
            done.attr('checked',true);
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
        var that = $(this);
        that.parent().toggleClass('done');
        // mark as done in database and save
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