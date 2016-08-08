define("placeholder", function(require, exports, module) {
    var $ = jQuery;
    var Placeholder = function (dom) {
        $(dom).find('[placeholder]').each(function () {
            var t = $(this);
            var p = t.attr('placeholder');
            if( p && !t.data('placeholder-init') ) {
                t.on('blur', function(){
                    if (!t.val()) {
                        t.val(p);
                    }
                }).on('focus', function () {
                    if (p === t.val()) {
                        t.val('');
                    }
                }).trigger('blur');
                t.data({'placeholder-init': true});
            }else if(p && !t.val()){
                t.val(p);
            }
        });
    };
    Placeholder.clear = function(_form){
        _form.find('[placeholder]').each(function(){
            var t = $(this);
            if(t.val() === t.attr('placeholder')){
                t.val('');
            }
        });
    }
    return Placeholder;
});