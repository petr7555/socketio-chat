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
    socket.on('user connected', function (username) {
        io.emit('user connected', username);

        socket.on('disconnect', () => {
            io.emit('user disconnected', username);
        });
    });


    
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
});

const PORT = 3002;

server.listen(PORT, () => {
    console.log(`listening on *:${3002}`);
});
