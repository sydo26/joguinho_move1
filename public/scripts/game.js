const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const paints = [];
const updates = [];
const setups = [];

let keysPressed = [];
let keysUpped = [];

function draw() {
  ctx.fillStyle = "rgb(51,51,51)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const paintElement of paints) {
    paintElement();
  }
}

function update() {
  for (const updateElement of updates) {
    updateElement();
  }

  if (!document.hasFocus()) {
    keysPressed = [];
  }

  draw();

  keysUpped = [];
  requestAnimationFrame(update);
}

function setup() {
  // ----

  for (const setupElement of setups) {
    setupElement();
  }
  console.log("setup");

  document.addEventListener("keydown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const key = e.key;

    let index = keysPressed.findIndex((value) => key === value);
    if (index === undefined || index < 0) {
      keysPressed.push(key);
    }
  });

  document.addEventListener("keyup", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const key = e.key;
    keysUpped.push(key);
    let index = keysPressed.findIndex((value) => key === value);
    if (index >= 0) {
      keysPressed.splice(index, 1);
    }
  });

  canvas.width = globalState.data.canvas.size.w;
  canvas.height = globalState.data.canvas.size.h;

  update();
}
window.onload = () => {
  if (socket.connected && Object.keys(globalState).length > 0) {
    setup();
  } else {
    let interval = setInterval(() => {
      console.log("aguardando a conexão...");
      if (socket.connected && Object.keys(globalState).length > 0) {
        setup();
        clearInterval(interval);
      }
    }, 100);
  }
};
