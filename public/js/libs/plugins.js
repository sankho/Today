(function($){

    /*!
     * HTML5 Placeholder jQuery Plugin v1.7
     * @link http://github.com/mathiasbynens/Placeholder-jQuery-Plugin
     * @author Mathias Bynens <http://mathiasbynens.be/>
     */
    (function(f,z){var e=z in document.createElement('input'),a=z in document.createElement('textarea');if(e&&a){f.fn.placeholder=function(){return this}}else{f.fn.placeholder=function(){return this.filter((e?'textarea':':input')+'['+z+']').bind('focus.'+z,b).bind('blur.'+z,d).trigger('blur.'+z).end()}}function c(h){var g={},i=/^jQuery\d+$/;f.each(h.attributes,function(k,j){if(j.specified&&!i.test(j.name)){g[j.name]=j.value}});return g}function b(){var g=f(this);if(g.val()===g.attr(z)&&g.hasClass(z)){if(g.data(z+'-password')){g.hide().next().show().focus()}else{g.val('').removeClass(z)}}}function d(g){var j,i=f(this);if(i.val()===''||i.val()===i.attr(z)){if(i.is(':password')){if(!i.data(z+'-textinput')){try{j=i.clone().attr({type:'text'})}catch(h){j=f('<input>').attr(f.extend(c(i[0]),{type:'text'}))}j.removeAttr('name').data(z+'-password',true).bind('focus.'+z,b);i.data(z+'-textinput',j).before(j)}i=i.hide().prev().show()}i.addClass(z).val(i.attr(z))}else{i.removeClass(z)}}f(function(){f('form').bind('submit.'+z,function(){var g=f('.'+z,this).each(b);setTimeout(function(){g.each(d)},10)})});f(window).bind('unload.'+z,function(){f('.'+z).val('')})})(jQuery,'placeholder');

}(this.jQuery));




window.log = function(){
    log.history = log.history || [];   
    log.history.push(arguments);
    if(this.console){
        console.log( Array.prototype.slice.call(arguments) );
    }
};
(function(doc){
    var write = doc.write;
    doc.write = function(q){ 
        log('document.write(): ',arguments); 
        if (/docwriteregexwhitelist/.test(q)) write.apply(doc,arguments);  
    };
})(document);


/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);