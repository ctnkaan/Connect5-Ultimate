const log = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;
  
    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
};
  
const onChatSubmitted = (sock) => (e) => {
    e.preventDefault();
  
    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit("message", text);
};

const getBoard = (canvas, numCells=20) => {

  const con = canvas.getContext("2d");
  const cellSize = Math.floor(canvas.width/numCells);

  const fillCell = (x,y,color) => {
    con.fillStyle = color;
    con.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
  };

  const drawGrid = () => {
    con.strokeStyle = "#333";
    con.beginPath();

    for (let i = 0; i < numCells+1; i++) {
      con.moveTo(i*cellSize,0);
      con.lineTo(i*cellSize,cellSize*numCells);
      con.moveTo(0,i*cellSize);
      con.lineTo(cellSize*numCells,i*cellSize);
    }
    con.stroke();
  };

  const clear = () => {
    con.clearRect(0, 0, canvas.width, canvas.height)
  }

  const reset = (board) => {
    clear();
    drawGrid();
    renderBoard(board)
  }

  const renderBoard = (board = []) => {
    board.forEach((row,y) => {
      row.forEach((color,x) => {
        color && fillCell(x,y,color);
      });
    });
  };

  

  const getCellCords = (x,y) => {
    return {
      x: Math.floor(x/cellSize),
      y: Math.floor(y/cellSize)
    };
  };

  return {fillCell, reset, getCellCords};
};

const getClickCords = (element, ev) => {
  const {top, left} = element.getBoundingClientRect();
  const {clientX, clientY} = ev;
  
  return {
    x: clientX - left,
    y: clientY - top
  };
};



(() => {

  const canvas = document.querySelector("canvas");
  const { fillCell, reset, getCellCords } = getBoard(canvas);
  const sock = io();

  const onClick = (e) => {
    const {x,y} = getClickCords(canvas, e);
    sock.emit("turn", getCellCords(x,y));
  };

  sock.on("board", reset);

  sock.on("message", log);
  sock.on("turn", ({x,y,color}) => fillCell(x,y,color));
  
  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));
  document
    .addEventListener("click", onClick);
})();