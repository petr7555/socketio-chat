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

io.on('connection', (socket) => {
    socket.on('user_connected', (username) => {
        // Send event to ALL clients when a new client connects
        io.emit('user_connected', username);

        socket.on('disconnect', () => {
            // Send event to ALL clients when client disconnects
            io.emit('user_disconnected', username);
        });
    });

    socket.on('chat_message', (data) => {
        // Send event to all clients apart from the client who emitted the event
        socket.broadcast.emit('chat_message', data);
    });

    socket.on('typing', (data) => {
        // Send event to all clients apart from the client who emitted the event
        socket.broadcast.emit('typing', data);
    });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
});
