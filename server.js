const express = require("express");

const crypto = require("crypto");

const app = express();

const httpServer = require("http").createServer(app);

const opts = {
  pingTimeout: 30000,
  cors: {
    origin: ["*"],
  },
};

const io = require("socket.io")(httpServer, opts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(require("path").join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.sendFile(require("path").join(__dirname, "index.html"));
});

const data = {
  canvas: {
    size: { w: 1024, h: 768 },
  },
};

class Player {
  constructor(name, color, x, y, posClone) {
    this.name = name;
    this.pos = { x, y };
    this.posClone = posClone;
    this.maxSpeed = 10;
    this.color = color;
    this.size = { w: 25, h: 25 };
  }

  updateClone({ x, y }) {
    this.posClone.x = x;
    this.posClone.y = y;
  }

  updatePosition() {
    // caso ultrapasse o corpo todo do player no left, ele cria remove o clone e muda a posição do jogador para o right
    if (this.pos.x + this.size.w / 2 <= 0) {
      this.pos.x = data.canvas.size.w - this.size.w / 2;
      this.posClone.x = "none";
    }

    // caso ultrapasse o corpo todo do player no right, ele cria remove o clone e muda a posição do jogador para o left
    if (this.pos.x - this.size.w / 2 >= data.canvas.size.w) {
      this.pos.x = this.size.w / 2;

      this.posClone.x = "none";
    }

    // caso ultrapasse o corpo todo do player no top, ele cria remove o clone e muda a posição do jogador para o bottom
    if (this.pos.y + this.size.h / 2 <= 0) {
      this.pos.y = data.canvas.size.h - this.size.h / 2;
      this.posClone.y = "none";
    }

    // caso ultrapasse o corpo todo do player no bottom, ele cria remove o clone e muda a posição do jogador para o top
    if (this.pos.y - this.size.h / 2 >= data.canvas.size.h) {
      this.pos.y = this.size.h / 2;
      this.posClone.y = "none";
    }
  }

  moveLeft(speed) {
    this.pos.x -= speed > this.maxSpeed ? this.maxSpeed : speed;
  }

  moveRight(speed) {
    this.pos.x += speed > this.maxSpeed ? this.maxSpeed : speed;
  }

  moveTop(speed) {
    this.pos.y -= speed > this.maxSpeed ? this.maxSpeed : speed;
  }

  moveBottom(speed) {
    this.pos.y += speed > this.maxSpeed ? this.maxSpeed : speed;
  }
}

function randomId() {
  const hash = crypto.randomBytes(5);
  return hash.toString("hex");
}

const players = [];

io.on("connection", (socket) => {
  const idConnection = randomId();
  console.log("Novo jogador conectado com o id:", idConnection);

  const player = new Player(
    idConnection,
    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`,
    Math.random() * (800 - 200) + 200,
    Math.random() * (600 - 200) + 200,
    { x: "none", y: "none" }
  );

  players.push(player);

  console.log(
    players.map((x) => {
      return x.name;
    })
  );

  socket.broadcast.emit("player add", player);

  socket.emit("initialData", {
    current: player,
    data,
    players: players.filter((x) => x.name !== player.name),
  });

  socket.on("move left", ({ speed, posClone }) => {
    player.updateClone(posClone);
    player.updatePosition();
    player.moveLeft(speed);

    socket.broadcast.emit("player movement left", {
      x: player.pos.x,
      name: player.name,
      posClone: player.posClone,
    });
  });

  socket.on("move right", ({ speed, posClone }) => {
    player.updateClone(posClone);
    player.updatePosition();
    player.moveRight(speed);

    socket.broadcast.emit("player movement right", {
      x: player.pos.x,
      name: player.name,
      posClone: player.posClone,
    });
  });

  socket.on("move top", ({ speed, posClone }) => {
    player.updateClone(posClone);
    player.updatePosition();
    player.moveTop(speed);

    socket.broadcast.emit("player movement top", {
      y: player.pos.y,
      name: player.name,
      posClone: player.posClone,
    });
  });

  socket.on("move bottom", ({ speed, posClone }) => {
    player.updateClone(posClone);
    player.updatePosition();
    player.moveBottom(speed);

    socket.broadcast.emit("player movement bottom", {
      y: player.pos.y,
      name: player.name,
      posClone: player.posClone,
    });
  });

  socket.on("disconnect", () => {
    console.log("Jogador", idConnection, "desconectou!");
    const index = players
      .map((x, i) => ({
        found: x.name === idConnection,
        index: i,
      }))
      .filter((x) => x.found)[0]?.index;

    players.splice(index, 1);

    socket.broadcast.emit("player remove", { name: idConnection });
  });
});

httpServer.listen(80, () => {
  console.log("Server on");
});
