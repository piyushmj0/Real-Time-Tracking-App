const express = require('express');
const app = express();

const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const io = socketIo(server);


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    socket.on('locationUpdate', function (data) {
        io.emit('location-update', {id: socket.id, ...data});
    });
    socket.on('disconnect', function () {
        io.emit('user-disconnected', socket.id);
    });
});


app.get('/', (req, res) => {
    res.render('index');
});
const START_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

function startServer(port) {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    }).on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} in use, trying ${port + 1}`);
            startServer(port + 1);
        } else {
            console.error(err);
            process.exit(1);
        }
    });
}

startServer(START_PORT);
