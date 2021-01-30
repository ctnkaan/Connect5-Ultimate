const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const randomColor = require("randomcolor");
const createBoard = require("./create-board");
const createCooldown = require("./createCooldown");

const app = express();

app.use(express.static(`${__dirname}/../client`));


const server = http.createServer(app);
const io = socketio(server);
const {clear,getBoard,makeTurn} = createBoard(20);

io.on('connection', (sock) => {
    io.emit("message","----PLAYER CONNCECTED----")
    const color = randomColor();

    const cooldown = createCooldown(2000);

    sock.on('message', (text) => io.emit('message', text));
  
    const onTurn = ({ x, y }) => {
      if (cooldown()) {
        io.emit('turn', { x, y, color });
        const playerWin = makeTurn(x, y, color);
  
        if (playerWin) {
          sock.emit('message', '----YOU WIN----');
          io.emit('message', '----NEW ROUND----');
          clear();
          io.emit('board');
        }
      }
    };
  
    sock.on('turn', onTurn);
  
    sock.emit('board', getBoard());
  });

server.listen(3000, () => {
    console.log("server started port 3000");
});