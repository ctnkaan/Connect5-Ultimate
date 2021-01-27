const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(`${__dirname}/../client`));


const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (sock) => {
    sock.emit("message", "----- Connected -----");

    sock.on("message", (text) => io.emit("message", text));
});

server.listen(3000, () => {
    console.log("server started port 3000");
});