var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var names = [];

app.use(express.static(__dirname));

io.on('connection', function(client) {
    client.emit('names', names);

    client.on('messages', function (data) {
        var nickname = client.nickname;
        client.broadcast.emit('messages', nickname, data);
        client.emit('messages', nickname, data);      
    });

    client.on('join', function (name) {
        if (name && name.length > 0) {
            client.nickname = name;
            names.push(name);
            console.log(name + " joined the chat");
            client.broadcast.emit('join',name);
            client.emit('join',name);
        }
    });

    client.on('disconnect', function() {
        var nickname = client.nickname;
        if (nickname && nickname.length > 0) {
            console.log(nickname + " has left the chat");
            names.splice(names.indexOf(nickname), 1);
            client.broadcast.emit('names',names);
        }
    })
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080);