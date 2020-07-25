$(function() {
    let $elmInputMessage    = $('input#message');
    let $elmInputUsername   = $('input[name="username"]');
    let $elmInputAvatar     = $('input[name="avatar"]');
    let $elmTotalUserInvite = $("span.total-user-invite");
    let prefixSocket        = $('input[name="prefixSocket"]').val();
    let $elmFormChat        = $('form#form-chat');
    let $elmListMessage     = $('div#area-list-message');
    let $tmplMessageChat    = $('#template-chat-message')
    let $tmplNotifyError    = $('#template-notify-error');
    let $tmplUserInvite     = $('#template-user-invite');
    let $tmplUserTyping     = $('#template-user-typing');
    let $elmTotalUser	    = $('span#total-user');
    let $elmListUsers	    = $('div#list-users');
    let $tmplUserOnline     = $('#template-user-online');
    let socket              = io.connect('http://localhost:8181');
    let timeoutObj;
    let emojioneArea = $elmInputMessage.emojioneArea();

    socket.on("connect", () => {
        socket.emit(`${prefixSocket}USER_CONNECT`, paramsUserConnectServer($elmInputUsername, $elmInputAvatar));
    })

    socket.on(`${prefixSocket}RETURN_ALL_MESSAGE`, (data) => {
        showListMessage(data, $elmInputUsername, $tmplMessageChat, $elmListMessage)
    });

    socket.on(`${prefixSocket}RETURN_ERROR`, (data) => {
        showError(data, $tmplNotifyError, $elmFormChat)
    });

    socket.on(`${prefixSocket}SEND_USER_TYPING`, (data) => {
        showTyping(data, $tmplUserTyping, $elmFormChat)
    });

    socket.on(`${prefixSocket}SEND_ALL_LIST_USER`, (data) => {
        showListUserOnline(data, $elmInputUsername, $tmplUserOnline,  $elmListUsers, $elmTotalUser)
    })

    // CLIENT SEND MESSAGE
    $elmFormChat.submit(function() {
        socket.emit(`${prefixSocket}CLIENT_SEND_ALL_MESSAGE`, paramsUserSendAllMessage($elmInputMessage, $elmInputUsername, $elmInputAvatar));

        $elmInputMessage.val('');
        emojioneArea.data("emojioneArea").setText('');
        $("div#area-notify").remove();
        return false;
    });

    function cancelTyping() {
        socket.emit(`${prefixSocket}CLIENT_SEND_TYPING`, paramsUserTyping($elmInputUsername, false));
    }

    $elmInputMessage.data("emojioneArea").on("keyup paste emojibtn.click", function() {
        if (this.getText().length > 3) {
            clearTimeout(timeoutObj);
            timeoutObj = setTimeout(cancelTyping, 2000);
            socket.emit(`${prefixSocket}CLIENT_SEND_TYPING`, paramsUserTyping($elmInputUsername, true));
        }
    });

    socket.on(`${prefixSocket}SEND_NEW_REQUEST_ADD_FRIEND`, (data) => {
        let totalUserInvite     = parseInt($elmTotalUserInvite.html());
        let template = $tmplUserInvite.html();
        
        if(totalUserInvite == 0) {
            $(`<li><ul class="menu"><li>` 
                + Mustache.render(template, { data }) 
                + `</li></ul></li><li class="footer"><a href="#">View all</a></li>`).insertAfter($("li#list-user-invite")
            );
        }
        $elmTotalUserInvite.html(totalUserInvite + 1);
    });

    $(document).on("click", "button.control-add-friend" , function(event) {
        let toSocketID  = $(this).data("socketid");
        $.ajax({
            method: "POST",
            url: "/api/add-friend",
            dataType: "json",
            data: {
                fromUsername: $elmInputUsername.val(),
                fromAvatar  : $elmInputAvatar.val(),
                toUsername  : $(this).data("username"),
                toAvatar    : $(this).data("avatar")
            }
        }).done(function( data ) {
            socket.emit(`${prefixSocket}CLIENT_SEND_ADD_FRIEND`, {
                fromUsername: $elmInputUsername.val(),
                fromAvatar  : $elmInputAvatar.val(),
                toSocketID  : toSocketID
            });
        });
    });
})
