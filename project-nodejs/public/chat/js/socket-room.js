$(function() {
    let $elmInputUsername	= $('input[name="username"]');
    let $elmInputAvatar	    = $('input[name="avatar"]');
    let prefixSocket        = $('input[name="prefixSocket"]').val();
    let $elmInputRoom	    = $('input[name="roomID"]');
    let $tmplUserOnline     = $('#template-user-online');
    let $elmTotalUserOnline = $('span.total-user-online');
    let $elmTotalMember	    = $('span.total-member');
    let $elmListUsers	    = $('div#list-users');

    let socket = io.connect('http://localhost:8181');
    socket.on("connect", () => {
        socket.emit(`${prefixSocket}CLIENT_SEND_JOIN_ROOM`, paramsUserConnectRoom($elmInputUsername, $elmInputAvatar, $elmInputRoom));
    });

    socket.on(`${prefixSocket}SEND_LIST_USER`, (data) => {
        showListUserOnline(data, $elmInputUsername, $tmplUserOnline,  $elmListUsers, $elmTotalUserOnline)
        $elmTotalMember.html(data.length);
    });
})
