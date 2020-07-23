$(function() {
    let $elmInputUsername	= $('input[name="username"]');
    let $elmInputAvatar	    = $('input[name="avatar"]');
    let $elmInputRoom	    = $('input[name="roomID"]');

    let socket = io.connect('http://localhost:8181');
    socket.on("connect", () => {
        socket.emit('CLIENT_SEND_JOIN_ROOM', {
            username: $elmInputUsername.val(),
            avatar  : $elmInputAvatar.val(),
            room    : $elmInputRoom.val()
        });
    });

    socket.on('SERVER_SEND_LIST_USER', (data) => {
        console.log(data);
        // showListUserOnline(data, $elmInputUsername, $tmplUserOnline, $elmListUsers, $elmTotalUserOnline);
        // $elmTotalMember.html(data.length);
    });
})
