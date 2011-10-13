(function() {

    //procedural initilization stuff at the bottom

    var app       = $('#today');
    var form      = app.find('form#item');
    var newList   = app.find('form#new-list');
    var loading   = $('#loading');
    var list      = app.find('ol');
    var list_name = window.location.hash.replace('#','');

    var list_id   = list_name ? localStorage[list_name] : undefined;

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
            var item          = new TODO.item();
            item.doc.text     = what;
            item.doc.list_id  = list_id;
            item.save();
            writeListItem(item.doc);
            this.reset();
        } else {
            alert('What was that?');
        }
    }

    function deleteItem(e) {
        e.preventDefault();
        var item = new TODO.item();
        item.getById(this.rel);
        item.remove();
        $(this).parent().remove();
    }

    function markAsDone(e) {
        e.preventDefault();
        var item = new TODO.item();
        item.getById(this.rel);
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
                    var item = new TODO.item();
                    item.getById(key);
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
        
        var item = new TODO.item();
        item.getById(this.rel);
        item.doc.save = !saved;
        item.save();
        item = null;
    }

    function handleServerUpsert(doc,old) {
        if (old._id && old._id.indexOf('new') !== -1) {
            var $item = $('#today ol li[rel="' + old._id + '"]');
            if ($item) {
                $item.attr('rel',doc._id);
                $item.children().each(function() {
                    $(this).attr('rel',doc._id);
                });
            }
        }
    }

    function handleNewListForm(e) {
        e.preventDefault();
        var name = $('#name').val();
        $.ajax({
            url  : '/create-list',
            type : 'post',
            data : {
                name : name
            },
            success : function(data) {
                console.log(data);
                if (data.success) {
                    window.location.href = '/#' + name;
                    window.location.reload(true);
                } else {
                    alert('name\'s taken');
                }
            }
        });
    }

    function toggleLoad(callback) {
        list.slideToggle();
        loading.toggleClass('ghost');
    }

    function theTiesThatBind() {
        form.submit(handleForm);
        
        newList.submit(handleNewListForm);

        app.delegate('a.delete','click',deleteItem);
        app.delegate('a.done','click',markAsDone);
        app.delegate('a.edit','click',editItem);
        app.delegate('a.save','click',saveItem);

        TODO.subscribe('server-upsert', handleServerUpsert);
    }

    function getItems() {
        toggleLoad();
        $.ajax({
            url : '/get-items/' + list_name,
            success : function(data) {
                list_id                 = data.list_id;
                localStorage[list_name] = list_id;
                var todos               = data.items;
                var _todos              = {};
    
                for (var _id in todos) {
                    var todo = todos[_id];
                    if (todo.text && !_todos[todo._id]) {
                        _todos[todo._id] = todo;
                        writeListItem(todo);
                    }
                }
                
                TODO.collections.item = _todos;
                TODO.clientDB.saveCollection('item');
                theTiesThatBind();
                toggleLoad();
            }
        });
    }

    function sync(callback) {
        var uri   = 'sync';
        var items = TODO.clientDB.getCollection('item');
        var size  = items.size();
        var x     = 0;
        toggleLoad();

        for(var id in items) {
            x++;
            var doc = items[id];
            if (doc._id === id) {
                var item = new TODO.item();
                item.doc = doc;
                item.doc.list_id = list_id;
                if (x === size) {
                    setTimeout(callback,(100 * (x+1)));
                    toggleLoad();
                }
                saveItem(item,x);
            }
        }

        function saveItem(item,x) {
            setTimeout(function() {
                item.save();
            },(100 * x));
        }
    }

    // dom readiness. meaningless at the bottom of the body.
    $(function() {

        if (list_name) {
            //set namespace for local storage
            TODO.namespace += '_' + list_name;
            TODO.clientDB.init();

            form.show();

            if (navigator.onLine === false) {
                localStorage['beenOffline'] = 'true'; 
                var todos = TODO.clientDB.getCollection('item');
                if (todos) {
                    for (var _id in todos) {
                        var todo = todos[_id];
                        if (todo.text) {
                            writeListItem(todo);
                        }
                    }
                }
    
                theTiesThatBind();

            } else {

                TODO.serverDB ? TODO.serverDB.init() : '';

                if (localStorage['beenOffline'] === 'true') {
                    localStorage['beenOffline'] = false;
                    sync(getItems);
                } else {
                    getItems();
                }
                
            }
        } else {
            newList.show();
            theTiesThatBind();
        }
    });

}());