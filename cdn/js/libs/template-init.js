define("T", function(require, exports, module){
	$.fn.extend({
		toPager : function(opt){
			return $(this).each(function(){
				var _this = $(this);
				var o = $.extend({
					el : _this,
					totalPage : 1,
					currentPage: 1,
					preposePagesCount : 1,
					postposePagesCount : 1,
					firstPagesCount : 2,
					lastPagesCount : 2,
					'switch': null
				},opt);

				var paginationInner = '',
	                totalPage = o.totalPage,
	                currPage = o.currentPage,
	                preposePagesCount = o.preposePagesCount,
	                postposePagesCount = o.postposePagesCount,
	                firstPagesCount = o.firstPagesCount,
	                lastPagesCount = o.lastPagesCount,
	                offset;
	            /**
		         * @brief 渲染可点击的页码
		         * @param index {Number} 页码索引
		         *
		         */
		        function _renderActivePage(index) {
		            return '<a class="pagination-spec" data-page="' + index + '">' + index + '</a>';
		        }

	            // currPage前的页码展示
	            paginationInner += currPage === 1 
	            	? '<span class="pagination-start"><span>&lt;</span></span>' 
	            	: '<a class="pagination-prev"><span>&lt;</span></a>';
	            if (currPage <= firstPagesCount + preposePagesCount + 1) {
	                for(var i=1; i<currPage; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	            } else {
	                for(var i=1; i<=firstPagesCount; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	                paginationInner += '<span class="pagination-break">...</span>';
	                for(var i=currPage-preposePagesCount; i<=currPage-1; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	            }				
  
	            // currPage的页码展示
	            paginationInner += '<span class="pagination-curr">' + currPage + '</span>';

	            // currPage后的页码展示
	            if (currPage >= totalPage - lastPagesCount - postposePagesCount) {
	                offset = currPage + 1;
	                for(var i=currPage+1; i<=totalPage; i++) {
	                    paginationInner += _renderActivePage(i);
	                }

	            } else {
	                for(var i=currPage+1; i<=currPage+postposePagesCount; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	                paginationInner += '<span class="pagination-break">...</span>';
	                for(var i=totalPage-lastPagesCount+1; i<=totalPage; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	            }
				totalPage =  totalPage === 0 ? 1 : totalPage;	//totalPage==0时，下一页不可点击
	            paginationInner += currPage === totalPage 
	            	? '<span class="pagination-end"><span>&gt;</span></span>' 
	            	: '<a class="pagination-next"><span>&gt;</span></a>';
	            $(o.el).html(paginationInner);

	            function _switchToPage(page) {
		            o.currentPage = Number(page);
		            _this.toPager(o,true);	//不带初始化的分页加载
		            _this.trigger('switch', {
		                toPage: o.currentPage 
		            });
		        }
				_this.off('switch').on('switch',o["switch"]);
				$(o.el).off('click').on('click','.pagination-spec',function(e){
					_switchToPage( $(this).html() )
				}).on('click','.pagination-prev',function(e){
					_switchToPage( Number( $(this).siblings(".pagination-curr").html() ) - 1 )
				}).on('click','.pagination-next',function(e){
					_switchToPage( Number( $(this).siblings(".pagination-curr").html() ) + 1 )
				});
			});
		}
	});
	
    var T = function(_t, options){
    	var o = $.extend({
    		callback: function(data){}
    	},{
            url: _t.attr("data-url"),
            form: _t.attr("data-form"),
            pager : _t.attr("data-pager"),
            data: null,
            method : _t.attr("data-method") || "GET",
            totalshow: _t.attr("data-totalshow")
        }, options);

    	var compile = Handlebars.compile( _t.next().html() ),
    		pager = false,
    		formEvent = false;
        
        var sortby;
        var sort_order = 0;

        var ajax = function(o, toPage){
            var form = $(o.form||'<form>'),
                arr = form.serializeArray();
            var pageSize;

    		if( !formEvent ){
    			formEvent = true;
	    		form.on("submit", function(e){
	    			e.preventDefault();
                    T.cfg.beforeSubmit($(this));
	    			ajax(o);
	    		});
                _t.on('click', '.t-sort-item', function () {
                    var $this = $(this);
                    var sort = $this.data('sort');
                    if (sort === sortby) {
                        sort_order = sort_order ? 0 : 1;
                    }
                    else {
                        sortby = sort;
                        sort_order = 0;
                    }
                    form.trigger('submit');
                });
    		}

    		for (var i = 0; i < arr.length; i++) {
    			if( arr[i].name === "Pagesize" ){
    				pageSize = arr[i].value || 10;
    			}
    		};
    		arr.push({
    			name: "___t",
    			value: +new Date
    		});
    		arr.push({
    			name: "Page",
    			value: toPage || 1
    		});
            arr.push({
                name: "sortby",
                value: sortby
            });
            arr.push({
                name: "sort_order",
                value: sort_order
            });

            T.cfg.onSubmit(form);

            var tempHtml = _t.html();
            _t.html('<p class="text-center">数据加载中。。。</p>');
    		$.ajax({
    			url: "/index.php" + o.url,
    			dataType: "json",
    			type: ( o.method.toUpperCase() === "POST" ? "POST" : "GET" ),
    			data: o.data ? $.extend({}, o.data, {
                    ___t : + new Date,
                    Page: toPage || 1
                }) : arr,
    			success: function(data){
    				if((typeof data.code !== 'undefined') && data.code != 1){
                        _t.html(tempHtml);
	                    alert( data.message );
	                }else{
	                	_t.html( compile( data ) ).find('.t-sort-item').each(function () {
                            var item = $(this);
                            if(item.data('sort') === sortby) {
                                item.addClass(sort_order ? 't-sort-desc' : 't-sort-asc');
                            }
                        });

	                	if( o.pager ){
	                		pager = $(o.pager).toPager({
	                			totalPage: Math.ceil( data.total / pageSize),
                                currentPage: toPage,
	                			"switch": function(ev, e){
	                				ajax(o, e.toPage);
	                			}
	                		});
	                	}

	                	if( o.totalshow ){
	                		$(o.totalshow).text( data.total );
	                	}

	                	o.callback(data);
                        T.cfg.callback(_t);
	                }
    			},
    			error: function(e){
    				alert( "服务器发生了错误！\nurl: " + o.url );
    			}
    		});
    	};

        if( o.url ){
            ajax(o);
        }else{
            var _html = Handlebars.compile( _t.next().html() )();
            _t.html( _html );
            T.cfg.callback(_t);
        }
    };

    T.cfg = {
        beforeSubmit: function(){},
        onSubmit: function(){},
        callback: function(){}
    };
    return T;
});