var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // Send message to client
    socket.emit('SERVER_SEND_SOCKET_ID', {
        'socket_id': socket.id, 
        'name': 'Socket'
    });

    // Get message from client
    /*
    socket.on('CLIENT_SEND_SOCKET_MESSAGE', (data) => {
        socket.emit('SERVER_RETURN_MESSAGE', {
            'str': data.toUpperCase()
        });
    });
    */
    /*
    socket.on('CLIENT_SEND_SOCKET_MESSAGE', (data) => {
        io.emit('SERVER_RETURN_MESSAGE', {
            'str': data.toUpperCase()
        });
    });
    */
    socket.on('CLIENT_SEND_SOCKET_MESSAGE', (data) => {
        socket.broadcast.emit('SERVER_RETURN_MESSAGE', {
            'str': data.toUpperCase()
        });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});