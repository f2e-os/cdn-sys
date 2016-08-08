(function() {

    var title = $('<h4 class="modal-title">title</h4>');
    var close = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    var header = $('<div class="modal-header"></div>').append( close ).append( title );

    var body = $('<div class="modal-body"></div>');
    
    var btn_ok = $('<button type="button" class="btn btn-primary btn-ok">确定</button>');
    var btn_cancel = $('<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>');
    var footer = $('<div class="modal-footer"></div>');


    var content = $('<div class="modal-content"></div>');
    var dialog = $('<div class="modal-dialog"></div>');
    var modal = $('<div class="modal fade" tabindex="-1" role="dialog"></div>').append( dialog.append(content) ).appendTo( document.body );
    
    var ev = {}, ok_hide;
    $.each( ["show","shown","hide","hidden","yes","no"], function(i, eve){
        ev[eve] = [];
        modal[eve] = function(fn){
            ev[eve].push(fn);
            return modal;
        };
        modal.on( eve + ".bs.modal", function(e){
            if(ok_hide){
                return;
            }else if("hide" === eve){
                for (var i = 0; i < ev.no.length; i++) {
                    ev.no[i].call(this, e)
                }        
            }
            for (var i = 0; i < ev[eve].length; i++) {
                ev[eve][i].call(this, e)
            }
        });
    });

    modal.on("click", ".btn-ok", function(e){
        ok_hide = true;
        for (var i = 0; i < ev.yes.length; i++) {
            if( false === ev.yes[i].call(modal, e) ){
                return false;
            }
        }
        modal.modal("hide");
        ok_hide = false;
    });
    
    // 对应原 bs-modal 
    // http://v3.bootcss.com/javascript/#modals-events
    function Assemble(opt){
        $.each( ["show","shown","hide","hidden","yes","no"], function(i, eve){
            ev[eve] = [];
        });

        content.empty();

        if( opt.header ){
            content.append( header );
            title.html( opt.title || "温馨提示" );
        }
        content.append( body ).append( footer );
        body.html( opt.body );

        footer.empty();
        if( opt.buttons ){
            if( opt.buttons.yes ){
                footer.append( btn_ok.html( opt.buttons.yes ) );
            }
            if( opt.buttons.no ){
                footer.append( btn_cancel.html( opt.buttons.no ) );
            }
        }
        dialog.css({
            width: opt.width || 600
        });
        return modal.modal({
            show: false,
            backdrop: opt.backdrop,
            keyboard: opt.keyboard
        }).modal("show");
    }

    $.extend({
        dialog: function(info, cfg){
            return Assemble($.extend({
                header: true,
                body: info || "",
                buttons:{
                    yes: "确定",
                    no: "取消"
                },
                keyboard: true,
                backdrop: "static"
            },cfg));
        },
        alert: function(info, cfg){
            return Assemble($.extend({
                header: true,
                body: info || "",
                buttons:{
                    yes: "确定"
                },
                keyboard: false,
                backdrop: "static"
            },cfg));
        },
        confirm: function(info, cfg){
            return Assemble($.extend({
                header: true,
                body: info || "",
                buttons:{
                    yes: "确定",
                    no: "取消"
                }
            },cfg));
        },
        prompt: function(title, str, callback, cfg){
            callback = callback || function(){};
            var modal = Assemble({
                header: true,
                title: title,
                body: '<input type="text" class="form-control" value="'+(str||'')+'"/>',
                buttons:{
                    yes: "确定",
                    no: "取消"
                }
            }, cfg);
            modal.yes(function(e){
                return callback.call(this, this.find("input").val());
            });
            modal.shown(function(){
                $(this).find('input').select().focus();
            });
            return  modal;
        }
    });
})();

