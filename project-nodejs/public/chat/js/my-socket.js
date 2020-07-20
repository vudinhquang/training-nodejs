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
        socket.emit('USER_CONNECT', {
            username: $elmInputUsername.val(),
            avatar: $elmInputAvatar.val()
        });
    })

    socket.on("SERVER_RETURN_ALL_MESSAGE", (data) => {
        let typeShow = "";
        let classUsername = "pull-left";
        let classCreated = "pull-right";

        if($elmInputUsername.val() == data.username ){
            typeShow        = "right";
            classUsername   = "pull-right";
            classCreated    = "pull-left";
        }

        let template = $tmplMessageChat.html();
        $elmListMessage.append(Mustache.render(template, { typeShow, classUsername, classCreated, data }));
    });

    socket.on("SERVER_RETURN_ERROR", (data) => {
        let template = $tmplNotifyError.html();
        $(Mustache.render(template, { data })).insertBefore($elmFormChat);
    });

    socket.on("SERVER_SEND_USER_TYPING", (data) => {
        if(data.showTyping) {
            let template = $tmplUserTyping.html();
            $(Mustache.render(template, { data })).insertBefore($elmFormChat);
        } else {
            $("p.show-typing").remove();
        }
    });

    socket.on("SERVER_SEND_ALL_LIST_USER", (data) => {
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
    })

    // CLIENT SEND MESSAGE
    $elmFormChat.submit(function() {
        socket.emit('CLIENT_SEND_ALL_MESSAGE', {
            content: $elmInputMessage.val(),
            username: $elmInputUsername.val(),
            avatar: $elmInputAvatar.val()
        });

        $elmInputMessage.val('');
        emojioneArea.data("emojioneArea").setText('');
        $("div#area-notify").remove();
        return false;
    });

    function cancelTyping() {
        socket.emit('CLIENT_SEND_TYPING', { username: $elmInputUsername.val(), showTyping: false });
    }

    $elmInputMessage.data("emojioneArea").on("keyup paste emojibtn.click", function() {
        if (this.getText().length > 3) {
            clearTimeout(timeoutObj);
            timeoutObj = setTimeout(cancelTyping, 2000);
            socket.emit('CLIENT_SEND_TYPING', { username: $elmInputUsername.val(), showTyping: true });
        }
    })
})