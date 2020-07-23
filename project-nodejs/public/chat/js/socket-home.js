$(function() {
    let $elmInputMessage    = $('input#message');
    let $elmInputUsername   = $('input[name="username"]');
    let $elmInputAvatar     = $('input[name="avatar"]');
    let $elmFormChat        = $('form#form-chat');
    let $elmListMessage     = $('div#area-list-message');
    let $tmplMessageChat    = $('#template-chat-message')
    let $tmplNotifyError    = $('#template-notify-error');
    let $tmplUserTyping     = $('#template-user-typing');
    let $elmTotalUser	    = $('span#total-user');
    let $elmListUsers	    = $('div#list-users');
    let $tmplUserOnline     = $('#template-user-online');
    let socket              = io.connect('http://localhost:8181');
    let timeoutObj;
    let emojioneArea = $elmInputMessage.emojioneArea();

    socket.on("connect", () => {
        socket.emit('USER_CONNECT', paramsUserConnectServer($elmInputUsername, $elmInputAvatar));
    })

    socket.on("SERVER_RETURN_ALL_MESSAGE", (data) => {
        showListMessage(data, $elmInputUsername, $tmplMessageChat, $elmListMessage)
    });

    socket.on("SERVER_RETURN_ERROR", (data) => {
        showError(data, $tmplNotifyError, $elmFormChat)
    });

    socket.on("SERVER_SEND_USER_TYPING", (data) => {
        showTyping(data, $tmplUserTyping, $elmFormChat)
    });

    socket.on("SERVER_SEND_ALL_LIST_USER", (data) => {
        showListUserOnline(data, $elmInputUsername, $tmplUserOnline,  $elmListUsers, $elmTotalUser)
    })

    // CLIENT SEND MESSAGE
    $elmFormChat.submit(function() {
        socket.emit('CLIENT_SEND_ALL_MESSAGE', paramsUserSendAllMessage($elmInputMessage, $elmInputUsername, $elmInputAvatar));

        $elmInputMessage.val('');
        emojioneArea.data("emojioneArea").setText('');
        $("div#area-notify").remove();
        return false;
    });

    function cancelTyping() {
        socket.emit('CLIENT_SEND_TYPING', paramsUserTyping($elmInputUsername, false));
    }

    $elmInputMessage.data("emojioneArea").on("keyup paste emojibtn.click", function() {
        if (this.getText().length > 3) {
            clearTimeout(timeoutObj);
            timeoutObj = setTimeout(cancelTyping, 2000);
            socket.emit('CLIENT_SEND_TYPING', paramsUserTyping($elmInputUsername, true));
        }
    })
})
