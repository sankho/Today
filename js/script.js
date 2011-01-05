/* Author: 

*/

(function($,undefined) {
    
    if (typeof window.localStorage === 'undefined') {
        return alert('Get a better browser');
    }
        
    $('input,textarea').placeholder();
    
    var lastHour = localStorage['lastHour'] ? parseInt(localStorage['lastHour'],10) : 18;  // 6 o'clock
    var lastMin  = localStorage['lastMin']  ? parseInt(localStorage['lastMin'],10)  : 30;  // 30 minutes
    var day      = 24 * 60;
    
    var that = $('#today');
    var form = that.find('form');
    var list = that.find('ol');
    
    var db    = localStorage['today'];
    var last  = parseInt(localStorage['todayLastSaved'],10);
    var date  = new Date().getDate();
    
    if (db && db.length > 0) {
        db = JSON.parse(db);
        if (last && last !== date) {
            var newdb = [];
            for (var i=0; i<db.length; i++) {
                var item = db[i];
                if (item.save) {
                    newdb.push(item);
                }
            }
            db = newdb;
            saveDB();
        }
        writeList();
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
        
        if (todo.done) {
            item.addClass('done');
        }
        
        var save = 'save';
        
        if (todo.save) {
            item.addClass('save');
            save = 'saved';
        }
        
        item.append('<a href="#" class="done" rel="' + size + '">mark as done</a><a href="#" class="save" rel="' + size + '">' + save + ' for tomorrow</a><a href="#" class="delete" rel="' + size + '">delete</a><a href="#" class="edit" rel="' + size + '">edit</a>');
        item.attr('rel',size);
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
        var index = that.attr('rel');
        
        db.splice(index,1);
        saveDB();
        writeList();
    }
    
    function setCounter() {
        var hour  = new Date().getHours();
        var min   = new Date().getMinutes();
        
        var endTime = ((lastHour * 60) + lastMin);
        var curTime = ((hour * 60) + min);
        
        var minutesLeft = endTime - curTime;
        
        if (minutesLeft < 1) {
            $('#today .header .time').text("is done.");
        } else {
        
            var hleft = parseInt((minutesLeft / 60),10);
            var mleft = minutesLeft % 60;
            
            var last   = lastHour;
            var period = 'AM';
            if (lastHour > 12) {
                last = last - 12;
                period = 'PM';
            }
            if (lastMin < 10) {
                lastMin = '0' + lastMin;
            }
            
            var string = [
                hleft, ' hour(s) and ', mleft, ' minute(s) before ', last, ':', lastMin, ' ', period
            ];
            
            $('#today .header .time').text(string.join(''));
        }
        
        var bar = $('#today-bar');
        var now = (hour * 60) + min; 
        var value = (now / day) * 100;
            value = value.toString() + '%';
        bar.animate({
            width : value
        },1000);
    }
    
    function startMovingSlider(e) {
        e.preventDefault();
        var body = $('body');
        body.mousemove(moveSlider);
        body.mouseup(function() {
            body.unbind('mousemove',moveSlider);
        });
    }
    
    function moveSlider(e) {
        var slider = $('#slider');
        var offset = slider.width() / 2;
        var leftVal = e.pageX - offset + 'px';
        slider.css({
            left    : leftVal
        });
        
        var width       = $('body').width();
        var timePercent = e.pageX / width;
        
        var minutes = timePercent * day;
        
        lastHour = localStorage['lastHour'] = parseInt(minutes / 60,10);
        lastMin  = localStorage['lastMin']  = parseInt(minutes % 60,10);
        setCounter();
    }
    
    function sliderResize() {
        var leftVal = ((lastHour * 60 + lastMin) / day) * 100 + '%';
        $("#slider").css({
          left : leftVal,
          display : 'block'
        });
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
                '<form>',
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
                    db[li.attr('rel')].text = text;
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
    
    function saveItem(e) {
        e.preventDefault();
        var that  = $(this);
        var key   = that.attr('rel');
        var li    = that.parent();
        var saved = li.hasClass('save');
        
        if (saved) {
            that.text('save for tomorrow');
            li.removeClass('save');
            db[key].save = false;
        } else {
            that.text('saved for tomorrow');
            li.addClass('save');
            db[key].save = true;
        }
        
        saveDB();
    }
    
    /** EVENT BINDINGS **/
    form.submit(handleForm);
    list.find('li a.done').live('click', markAsDone);
    list.find('li a.delete').live('click', deleteItem);
    list.find('li a.edit').live('click', editItem);
    list.find('li p').live('dblclick', editItem);
    list.find('li a.save').live('click', saveItem);
    $('#slider').live('mousedown',startMovingSlider);
    setCounter();
    setInterval(setCounter,60000);  // 1 minute?
    
    sliderResize();
    $(window).resize(sliderResize);
    
})(jQuery);