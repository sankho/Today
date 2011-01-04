/* Author: 

*/

(function($,undefined) {
    
    if (typeof window.localStorage === 'undefined') {
        return alert('Get a better browser');
    }
        
    $('input,textarea').placeholder();
        
    var that = $('#today');
    var form = that.find('form');
    var list = that.find('ol');
    
    var db    = localStorage['today'];
    var last  = parseInt(localStorage['todayLastSaved'],10);
    var date  = new Date().getDate();
    
    if (last && last === date) {
        if (db && db.length > 0) {
            db = JSON.parse(db);
            writeList();
        } else {
            db = [];
        }
    } else {
        db = [];
    }
    
    function saveDB() {
        localStorage['today']          = JSON.stringify(db);
        localStorage['todayLastSaved'] = new Date().getDate();
    }
    
    function writeList() {
        list.empty();
        
        //*/
        for(var i=0; i<db.length; i++) {
            writeListItem(db[i]);
        }
        //*/
        
        /*
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
        //*/
    }
    
    function writeListItem(todo) {
        var item = $('<li></li>');
        item.append('<p>' + todo.text + '</p>');
        
        var size = list.find('li').length;
        
        var done = [
            '<a href="#" class="done" rel="',
            size,
            '">mark as done</a>',
        ];
        done = done.join('');
        
        item.append(done);
        
        if (todo.done) {
            item.addClass('done');
        }
        
        item.append('<a href="#" class="delete" rel="' + size + '">delete</a><a href="#" class="edit" rel="' + size + '">edit</a>');
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
    
    function setCounter() {
        var hour  = new Date().getHours();
        var min   = new Date().getMinutes();
        var hleft = 23 - hour;
        var mleft = 59 - min;
        
        var string = [
            hleft, ' hours and ', mleft, ' minutes remaining'
        ];
        
        $('#today h1 small').text(string.join(''));
        var bar = $('#today-bar');
        if (!bar.length) {
            bar = $('<hr id="today-bar" />');
            $('body').append(bar).append('<hr id="a-full-day" />');
        }
        
        var day = 24 * 60;
        var now = (hour * 60) + min; 
        var value = (now / day) * 100;
            value = value.toString() + '%';
        bar.animate({
            width : value
        },1000);
        
    }
    
    function editItem(e) {
        e.preventDefault();
        var that = $(this);
        var key  = that.attr('rel');
        var li   = that.parent();
        var p    = li.find('p');
        
        if (p.is(':visible')) {
            p.hide();
            var form = $([
                '<form>',
                    '<input type="text" value="',
                    p.text(),
                    '" /><input type="submit" value="ok" />',
                '</form>'
            ].join(''));
            
            li.prepend(form);
            
            form.submit(function(e) {
                e.preventDefault();
                var text = form.find('input[type="text"]').val();
                if (!text) {
                    return alert('why not just delete it?');
                } else {
                    p.text(text);
                    db[key].text = text;
                    saveDB();
                    form.remove();
                    p.show();
                }
            });
            
        } else {
            li.find('form').remove();
            p.show();
        }
    }
    
    /** EVENT BINDINGS **/
    form.submit(handleForm);
    list.find('li a.done').live('click', markAsDone);
    list.find('li a.delete').live('click', deleteItem);
    list.find('li a.edit').live('click', editItem);
    setCounter();
    setInterval(setCounter,60000);  // 1 minute?
    
})(jQuery);