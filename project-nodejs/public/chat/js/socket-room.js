$(function() {
    let $elmInputUsername	= $('input[name="username"]');
    let $elmInputAvatar	    = $('input[name="avatar"]');
    let $elmInputRoom	    = $('input[name="roomID"]');
    let $tmplUserOnline     = $('#template-user-online');
    let $elmTotalUser	    = $('span.total-user');
    let $elmListUsers	    = $('div#list-users');

    let socket = io.connect('http://localhost:8181');
    socket.on("connect", () => {
        socket.emit('CLIENT_SEND_JOIN_ROOM', {
            username: $elmInputUsername.val(),
            avatar  : $elmInputAvatar.val(),
            room    : $elmInputRoom.val()
        });
    });

    socket.on('SERVER_SEND_LIST_USER', (data) => {
        let template = $tmplUserOnline.html();
        let xhtml    = '';
        for(let i = 0; i < data.length; i++) {
            let user = data[i];
            if(user.username !== $elmInputUsername.val()) {
                xhtml += Mustache.render(template, { user });
            }
        }
        $elmListUsers.html(xhtml);
        $elmTotalUser.html(data.length - 1);
    });
})
