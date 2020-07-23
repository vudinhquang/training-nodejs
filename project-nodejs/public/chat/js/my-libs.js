function paramsUserConnectServer($elmInputUsername, $elmInputAvatar){
    return {
        username: $elmInputUsername.val(),
        avatar  : $elmInputAvatar.val()
    }
}

function paramsUserConnectRoom($elmInputUsername, $elmInputAvatar, $elmInputRoom){
    return {
        username: $elmInputUsername.val(),
        avatar  : $elmInputAvatar.val(),
        room    : $elmInputRoom.val()
    }
}

function paramsUserSendAllMessage($elmInputMessage, $elmInputUsername, $elmInputAvatar){
    return {
        content: $elmInputMessage.val(),
        username: $elmInputUsername.val(),
        avatar: $elmInputAvatar.val()
    }
}

function paramsUserTyping($elmInputUsername, showTyping){
    return { 
        username: $elmInputUsername.val(), 
        showTyping: showTyping 
    }
}

function showListMessage(data, $elmInputUsername, $tmplMessageChat, $elmListMessage) {
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
}

function showError(data, $tmplNotifyError, $elmFormChat) {
    let template = $tmplNotifyError.html();
    $(Mustache.render(template, { data })).insertBefore($elmFormChat);
}

function showTyping(data, $tmplUserTyping, $elmFormChat){
    if(data.showTyping) {
        let template = $tmplUserTyping.html();
        $(Mustache.render(template, { data })).insertBefore($elmFormChat);
    } else {
        $("p.show-typing").remove();
    }
}

function showListUserOnline(data, $elmInputUsername, $tmplUserOnline,  $elmListUsers, $elmTotalUser){
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
}
