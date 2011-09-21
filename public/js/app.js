$(function() {

    var app  = $('#today');
    var form = app.find('form');
    var list = app.find('ol');

    var todos = TODO.clientDB.getCollection('item');

    for (var _id in todos) {
        todo = todos[_id];
        if (todo.text) {
            writeListItem(todo);
        }
    }

    function writeListItem(todo,key) {
        var item = $('<li></li>');
        item.append('<p>' + todo.text + '</p>');
        
        key = key || todo._id || list.find('li').length;
        
        if (todo.done) {
            item.addClass('done');
        }
        
        var save = 'save';
        
        if (todo.save) {
            item.addClass('save');
            save = 'saved';
        }
        
        item.append('<a href="#" class="done" rel="' + key + '">mark as done</a><!--<a href="#" class="save" rel="' + key + '">' + save + ' for tomorrow</a>--><a href="#" class="delete" rel="' + key + '">delete</a><a href="#" class="edit" rel="' + key + '">edit</a>');
        item.attr('rel',key);
        list.prepend(item);
    }

    function handleForm(e) {
        e.preventDefault();
        var what = $('#what').val();
        
        if (what.length > 0) {
            var item = new TODO.item();
            item.doc.text = what;
            item.save();
            writeListItem(item.doc);
            this.reset();
        } else {
            alert('What was that?');
        }
    }

    function deleteItem(e) {
        e.preventDefault();
        var item = new TODO.item().getById(this.rel);
        item.remove();
        $(this).parent().remove();        
    }

    function markAsDone(e) {
        e.preventDefault();
        var item = new TODO.item().getById(this.rel);
        item.doc.done = !item.doc.done;
        item.save();

        e.preventDefault();
        $(this).parent().toggleClass('done');
    }

    function editItem(e) {
        e.preventDefault();
        var that = $(this);
        var key  = that.attr('rel');
        var li   = that.parent();
        var p    = li.find('p');
        
        if (p.is(':visible')) {
            p.hide();
            var text = p.text().replace(/"/g, '&quot;')
            var form = $([
                '<form rel="',key,'">',
                    '<input type="text" value="',
                    text,
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
                    var item = new TODO.item().getById(key);
                    item.doc.text = text;
                    item.save();
                    form.remove();
                    p.show();
                }
            });
        } else {
            li.find('form').remove();
            p.show();
        }
    }
    
    function saveItem(e) {
        e.preventDefault();
        var that  = $(this);
        var key   = this.rel;
        var li    = that.parent();
        var saved = li.hasClass('save');
        li.toggleClass('save');

        if (saved) {
            that.text('save for tomorrow');
        } else {
            that.text('saved for tomorrow');
        }
        
        var item = new TODO.item().getById(this.rel);
        item.doc.save = !saved;
        item.save();
        item = null;
    }

    form.submit(handleForm);
    app.delegate('a.delete','click',deleteItem);
    app.delegate('a.done','click',markAsDone);
    app.delegate('a.edit','click',editItem);
    app.delegate('a.save','click',saveItem);


});