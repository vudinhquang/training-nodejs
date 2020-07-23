$(function() {
    let $elmInputUsername	= $('input[name="username"]');
    let $elmInputAvatar	    = $('input[name="avatar"]');
    let $elmInputRoom	    = $('input[name="roomID"]');
    let $tmplUserOnline     = $('#template-user-online');
    let $elmTotalUserOnline = $('span.total-user-online');
    let $elmTotalMember	    = $('span.total-member');
    let $elmListUsers	    = $('div#list-users');

    let socket = io.connect('http://localhost:8181');
    socket.on("connect", () => {
        socket.emit('CLIENT_SEND_JOIN_ROOM', paramsUserConnectRoom($elmInputUsername, $elmInputAvatar, $elmInputRoom));
    });

    socket.on('SERVER_SEND_LIST_USER', (data) => {
        showListUserOnline(data, $elmInputUsername, $tmplUserOnline,  $elmListUsers, $elmTotalUserOnline)
        $elmTotalMember.html(data.length);
    });
})
