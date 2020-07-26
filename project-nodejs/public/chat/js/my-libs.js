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

function showListUserOnline(data, $elmInputUsername, $elmInputRelationship, $elmListUsers, $elmTotalUserOnline){
    let parseInfo=JSON.parse($elmInputRelationship.val());
    let xhtml    = '';
    for(let i = 0; i < data.length; i++) {
        let user = data[i];
        if(user.username !== $elmInputUsername.val()) {
            let type = getRelationship(parseInfo, user.username);

            let templateId      = '#template-user-online';
            let $tmplUserOnline = $(templateId);
            if( type !== null){
                templateId += '-' + type;
                $tmplUserOnline = $(templateId);
            }
            
            let template = $tmplUserOnline.html();
            xhtml += Mustache.render(template, { user });
        }
    }
    $elmListUsers.html(xhtml);
    $elmTotalUserOnline.html(data.length - 1);
}

function getRelationship(objRelationship, value){
    let keys=Object.keys(objRelationship);
    for (let i=0; i< keys.length;i++) {
        let key=keys[i];
        for (let j = 0; j < objRelationship[key].length; j++) {
            let item=objRelationship[key][j];
            if (item.username === value) {
                return key;
            }
        }
    }
    return null;
}
