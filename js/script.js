$(document).ready(function() {
    $('#chat_form').submit(function(event) {
        event.preventDefault();
        var message = $('#chat_input').val();
        $('#chat_input').val("");
        socket.emit('messages', message);
    });

    $(window).on('unload', function() {
        socket.emit('disconnect');
    });
});

var socket = io.connect('http://localhost:8080');
var names = [];

socket.on('connect', function (data) {
    insertSystemMessage('Connected to chat');
    nickname = prompt("What is your name?");
    socket.emit('join', nickname);
});

socket.on('messages', function(name, data) {
    insertMessage(name, data);
});

socket.on('join', function(name) {
    addNewUser(name);
});

socket.on('names', function(names) {
    refreshUserArray(names);
});

function insertMessage(name, data) {
    $('#message-window').append("<p><b>" + name + "</b>: " + data + "</p>");
}

function insertSystemMessage(data) {
    $('#message-window').append("<p class='system-notice'>" + data + "</p>");
}

function addNewUser(name) {
    namesArr.push(name);
    namesArr.sort();
    updateNamesWindow();
}

function refreshUserArray(names) {
    namesArr = names.sort();
    updateNamesWindow();
}

function updateNamesWindow() {
    $('#username-window').empty();
    $.each(namesArr, function (index, value) {
        $('#username-window').append("<p>" + value + "</p>")
    });
}