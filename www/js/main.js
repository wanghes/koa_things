var baseUrl = "http://localhost:3000";

function getQueryParams(search){
    var search = search || window.location.search.substr(1);
    var mappers = search.split("&");
    var map = {};
    for(var i = 0; i < mappers.length; i++){
        var index = mappers[i].indexOf("=");
        map[mappers[i].substring(0,index)] = mappers[i].substring(index+1)
    }
    return map;
}

;(function(){
    if (location.pathname === '/index.html' || location.pathname === '/list.html') {
        var tableOfContent = document.getElementById('table-of-content')
        var timer = null
        function resetTableOfContent (rect) {
            scrollTop = localStorage.getItem('scrollTop') * 1
            scrollTop = scrollTop || 0
            tableOfContent.scrollTop = scrollTop
        }

        tableOfContent.addEventListener('scroll', function (event) {
            clearTimeout(timer)
            timer = setTimeout(function() {
                localStorage.setItem('scrollTop', tableOfContent.scrollTop)
            }, 50)
        }, false);

        resetTableOfContent();
    }

    if (location.pathname === '/index.html') {
        $.ajax({
            url:baseUrl + "/articles",
            type:"get",
            headers: {
                 'Authorization': 'Bearer '+localStorage.getItem('token')
            },
            success: function(res) {
                if (res.code) {
                    var data  = res.data;
                    if (data && data.length) {
                        var str = '<a href="/list.html" class="btn btn-default">修改内容</a>';
                        data.forEach(function(item){
                            str += '<a href="/index.html?id='+item.id+'" title="'+ item.title +'">'+item.title+'</a>'
                        });
                        $('#table-of-content').html(str);

                        var searchObj = getQueryParams();
                        if (searchObj.id) {
                            data.forEach(function(item){
                                if (searchObj.id == item.id) {
                                    $('.article').html(item.content);
                                    $('#title').html(item.title);
                                    $('.time').text(item.moment);
                                }
                            });
                        } else {
                            $('.article').html(data[0].content);
                            $('#title').html(data[0].title);
                            $('.time').text(data[0].moment);
                        }

                        //执行代码高亮方法
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
            }
        });
    }

    if (location.pathname === '/list.html') {
        ;(function(){
            $.ajax({
                url:baseUrl + "/list",
                type:"get",
                headers: {
                     'Authorization': 'Bearer '+localStorage.getItem('token')
                },
                success: function(res) {
                    if (res.code) {
                        var data  = res.data;
                        if (data && data.length) {
                            var str = [
                                '<div style="text-align:left; padding: 5px;">',
                                '<button id="homeBtn" class="btn btn-primary">回到首页</button> ',
                                '<button id="addtrack" class="btn btn-info">添加内容</button>',
                                '</div>'
                            ].join('');

                            data.forEach(function(item){
                                str += '<a href="/list.html?id='+item.id+'" title="'+ item.title +'">'+item.title+'</a>'
                            });
                            $('#table-of-content').html(str);

                            var searchObj = getQueryParams();
                            if (searchObj.id) {
                                data.forEach(function(item){
                                    if (searchObj.id == item.id) {
                                        $('.article').html(item.content);
                                        $('#title').html(item.title);
                                        $('.edit_box').append('<a href="/edit.html?id=' + item.id + '" class="btn btn-primary">修改</a>');
                                        $('.edit_box').append('&nbsp;<a data-id="' + item.id + '" class="deleteId btn btn-danger">删除</a>');
                                        $('.time').text(item.moment);
                                    }
                                });
                            } else {
                                $('.article').html(data[0].content);
                                $('#title').html(data[0].title);
                                $('.edit_box').append('<a href="/edit.html?id=' + data[0].id + '" class="btn btn-primary">修改</a>');
                                $('.edit_box').append('&nbsp;<a data-id="' + data[0].id + '" class="deleteId btn btn-danger">删除</a>');
                                $('.time').text(data[0].moment);
                            }

                            //执行代码高亮方法
                            $('pre code').each(function(i, block) {
                                hljs.highlightBlock(block);
                            });
                        }
                    }
                },
                error: function(err) {
                    if (err.status === 401) {
                        location.href = '/login.html';
                    }
                }
            });

            $(document).on('click', '#addtrack', function(){
                location.href = '/add.html';
            });

            $(document).on('click', '#homeBtn', function(){
                location.href = '/index.html';
            });

            $(document).on('click', '.deleteId', function(){
                var id = $(this).data('id');

                if (!id) return;

                var cfm = confirm("你确定要删除吗？");
                if (cfm) {
                    $.ajax({
                        type: "delete",
                        url: baseUrl + "/deleteArticle/"+id,
                        headers: {
                             'Authorization': 'Bearer '+localStorage.getItem('token')
                        },
                        success: function(data){
                            if (data.code == 1) {
                                location.href = '/list.html';
                            }
                        },
                        error: function(err) {
                            if (err.status === 401) {
                                //location.href = '/login.html';
                            }
                        }
                    });
                }
            });
        })();
    }

    if (location.pathname === '/add.html') {
        ;(function(){
            var $preview, editor, mobileToolbar, toolbar;
            Simditor.locale = 'en-US';
            toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent'];
            editor = new Simditor({
                textarea: $('#editor'),
                placeholder: '这里输入文字...',
                toolbar: toolbar,
                tabIndent: true,
                pasteImage: true,
                defaultImage: '/static/images/user.png',
                upload: location.search === '?upload' ? {
                    url: '/upload'
                } : false
            });

            $(document).on('click', '#addBtn', function(){
                var title, content;
                title = $('#title').val();
                content = editor.getValue();

                if (!title || !content) {
                    alert("必填都");
                    return;
                }

                try{
                    $.ajax({
                        url:baseUrl + "/addArticle",
                        type:"post",
                        data: {
                            title:title,
                            content:content
                        },
                        headers: {
                             'Authorization': 'Bearer '+localStorage.getItem('token')
                        },

                        success: function(res) {
                            if (res.code) {
                                location.href="/index.html"
                            }
                        }
                    });
                } catch(e) {
                    console.log(e);
                }
                return false;
            });
        })();
    }


    if (location.pathname === '/edit.html') {
        ;(function(){
            var $preview, editor, mobileToolbar, toolbar;
            Simditor.locale = 'en-US';
            toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent'];
            editor = new Simditor({
                textarea: $('#editor'),
                placeholder: '这里输入文字...',
                toolbar: toolbar,
                tabIndent: true,
                pasteImage: true,
                defaultImage: '/static/images/user.png',
                upload: location.search === '?upload' ? {
                    url: '/upload'
                } : false
            });

            var searchObj = getQueryParams();

            if (searchObj.id) {
                $.ajax({
                    url:baseUrl + "/getArticle/"+searchObj.id,
                    type:"get",
                    headers: {
                         'Authorization': 'Bearer '+localStorage.getItem('token')
                    },
                    success: function(res) {
                        if (res.code) {
                            var data  = res.data;
                            editor.setValue(data.content);
                            $('#title').val(data.title);
                        }
                    },
                    error: function(err) {
                        if (err.status === 401) {
                            location.href = '/login.html';
                        }
                    }
                });
            }

            $(document).on('click', '#editBtn', function(){
                var title, content;
                title = $('#title').val();
                content = editor.getValue();
                var id = searchObj.id;

                if (!id) {
                    alert("没有对应文章");
                    return;
                }


                if (!title || !content) {
                    alert("必填都");
                    return;
                }
                try{
                    $.ajax({
                        url:baseUrl + "/updateArticle",
                        type:"post",
                        data: {
                            id:id,
                            title:title,
                            content:content
                        },
                        headers: {
                             'Authorization': 'Bearer '+localStorage.getItem('token')
                        },
                        success: function(res) {
                            if (res.code) {
                                location.href="/index.html?id="+id
                            }
                        },
                        error: function(err) {
                            if (err.status === 401) {
                                location.href = '/login.html';
                            }
                        }
                    });
                } catch(e) {
                    console.log(e);
                }
                return false;
            });
        })();
    }

    if (location.pathname === '/register.html') {
        $(document).on('click', '#regBtn', function(){
            var name = $('#inputEmail').val();
            var password = $('#inputPassword').val();
            if (!name || !password) return;

            $.ajax({
                type: "post",
                url: baseUrl + "/insertUser",
                data: {
                    name:name,
                    password: password
                },
                success: function(data){
                    if (data.code==1) {
                        location.href = "/login.html";
                    } else {
                        alert(data.message);
                    }
                }
            });
            return false;
        });
    }

    if (location.pathname === '/login.html') {
        $(document).on('click', '#logBtn', function(){
            var name = $('#inputEmail').val();
            var password = $('#inputPassword').val();

            if (!name || !password) return;

            $.ajax({
                type: "post",
                url: baseUrl + "/doLogin",
                data: {
                    name:name,
                    password: password
                },
                success: function(data){
                    if (data.code==1) {
                        console.log(data.token)
                        window.localStorage.setItem('token',data.token);
                        window.localStorage.setItem('user', data.user.name);
                        location.href = "/list.html";
                    } else {
                        alert(data.message);
                    }
                }
            });
            return false;
        });
    }

})();
