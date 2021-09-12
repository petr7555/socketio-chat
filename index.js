const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const favicon = require('serve-favicon');

app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let usernames = ["All"];

io.on('connection', (socket) => {
    let name;

    function disconnect() {
        io.emit('user_disconnected', name);
        socket.leave(name);
        usernames = usernames.filter(username => username !== name);
        io.emit("usernames", usernames);
    }

    socket.on('user_connected', (username) => {
        name = username;
        // Send event to ALL clients when a new client connects
        io.emit('user_connected', username);
        socket.join(username);

        usernames.push(username);
        io.emit("usernames", usernames);
    });

    socket.on('disconnect', () => {
        disconnect();
    });

    socket.on('user_disconnected', () => {
        disconnect();
    });

    socket.on('chat_message', (data) => {
        const {targetUser} = data;
        if (targetUser === "All") {
            // Send event to all clients apart from the client who emitted the event
            socket.broadcast.emit('chat_message', data);
        } else {
            // Send private message
            socket.to(targetUser).emit("chat_message", data);
        }
    });

    socket.on('typing', (data) => {
        const {targetUser} = data;
        if (targetUser === "All") {
            // Send event to all clients apart from the client who emitted the event
            socket.broadcast.emit('typing', data);
        } else {
            // Send private message
            socket.to(targetUser).emit('typing', data);
        }
    });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
});
