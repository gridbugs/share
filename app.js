var fs = require('fs')
var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server)
var port = 9000

server.listen(port, function() {
    console.log('Server started!');
});

app.use(function(req, res) {
    var path = __dirname + req.path;
    if (!fs.existsSync(path)) {
        path = __dirname + '/index.html';
    }
    res.sendfile(path);
});

var messages = [];

io.on('connection', function(socket) {
    console.log('new connection');

    var id = '';

    socket.on('id', function(_id) {
        id = _id;
        console.log('got id: ' + id);
        socket.join(id);
        socket.emit('update', messages[id]);
    });

    socket.on('message', function(message) {
        console.log('got message ('+id+'): ' + message);
        messages[id] = message;
        io.sockets.in(id).emit('update', messages[id]);
    });

    socket.on('disconnect', function() {
        console.log('disconnection');
    });
});
