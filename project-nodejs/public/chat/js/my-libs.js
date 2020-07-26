function paramsUserConnectServer($elmInputUsername, $elmInputAvatar){
    return {
        username: $elmInputUsername.val(),
        avatar  : $elmInputAvatar.val()
    }
}

function paramsUserSendRequestAddFriend($elmInputUsername, $elmInputAvatar, toUsername, toAvatar){
    return {
        fromUsername: $elmInputUsername.val(),
        fromAvatar  : $elmInputAvatar.val(),
        toUsername,
        toAvatar
    }
}

function paramsClientSendAddFriend($elmInputUsername, $elmInputAvatar, toSocketID){
    return {
        fromUsername: $elmInputUsername.val(),
        fromAvatar  : $elmInputAvatar.val(),
        toSocketID
    }
}

function showNotify(content) {
    $.notify({
        message: content
    },{
        type: 'success',
        allow_dismiss: true,
        placement: {
            from: "bottom",
            align: "right"
        }
    });
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

function paramsUserSendAllMessageFromRoom($elmInputMessage, $elmInputUsername, $elmInputAvatar, $elmInputRoom){
    return {
        content: $elmInputMessage.val(),
        username: $elmInputUsername.val(),
        avatar: $elmInputAvatar.val(),
        room    : $elmInputRoom.val()
    }
}

function paramsUserTyping($elmInputUsername, showTyping){
    return { 
        username: $elmInputUsername.val(), 
        showTyping: showTyping 
    }
}

function paramsUserTypingFromRoom($elmInputUsername, showTyping, $elmInputRoom){
    return { 
        username: $elmInputUsername.val(), 
        showTyping: showTyping ,
        room    : $elmInputRoom.val()
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

function showListUserOnline(data, $elmInputUsername, $elmInputRelationship, $tmplUserOnline,  $elmListUsers, $elmTotalUserOnline){
    let parseInfo=JSON.parse($elmInputRelationship.val());
    let template = $tmplUserOnline.html();
    let xhtml    = '';
    for(let i = 0; i < data.length; i++) {
        let user = data[i];
        if(user.username !== $elmInputUsername.val()) {
            xhtml += Mustache.render(template, { user });
        }
    }
    $elmListUsers.html(xhtml);
    $elmTotalUserOnline.html(data.length - 1);
}
