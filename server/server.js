const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const randomColor = require("randomcolor");

const app = express();

app.use(express.static(`${__dirname}/../client`));


const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (sock) => {
    const color = randomColor();
    sock.emit("message", "----- Connected -----");

    sock.on("message", (text) => io.emit("message", text));
    sock.on("turn", ({x,y}) => io.emit("turn", {x,y,color}));
});

server.listen(3000, () => {
    console.log("server started port 3000");
});