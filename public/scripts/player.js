class Player {
  constructor(name, color, x, y, cX, cY, other = false) {
    this.name = name;
    this.color = color;
    this.pos = { x, y };
    this.posClone = { x: cX, y: cY };
    this.size = globalState.current.size;
    this.dir = { x: 0, y: 0 };
    this.speed = globalState.current.maxSpeed;
    this.font = "16px/25px Roboto";
    this.other = other;
  }

  // para o movimento da esquerda e da direita
  stopLeftAndRightMove() {
    this.dir.x = 0;
  }

  // para o moviemnto de cima e de baixo
  stopTopAndButtonMove() {
    this.dir.y = 0;
  }

  // move para a esquerda
  moveToLeft() {
    this.dir.x = -1;
  }

  // move para a direita
  moveToRight() {
    this.dir.x = 1;
  }

  // move para cima
  moveToTop() {
    this.dir.y = -1;
  }

  // move para baixo
  moveToBottom() {
    this.dir.y = 1;
  }

  drawClone() {
    if (this.posClone.x !== "none" || this.posClone.y !== "none") {
      let savefillStyle = ctx.fill;

      let x = this.pos.x;
      let y = this.pos.y;

      if (this.posClone.x !== "none") {
        //  && this.posClone.y === "none"
        x += canvas.width * this.posClone.x;
      }

      if (this.posClone.y !== "none") {
        y += canvas.height * this.posClone.y;
      }

      ctx.translate(x, y);
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = this.font;
      ctx.fillStyle = "white";
      ctx.fillText(this.name, 0, -this.size.h / 2 - 10);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.strokeRect(
        -this.size.w / 2,
        -this.size.h / 2,
        this.size.w,
        this.size.h
      );
      ctx.fillRect(
        -this.size.w / 2,
        -this.size.h / 2,
        this.size.w,
        this.size.h
      );
      ctx.stroke();
      ctx.translate(-x, -y);

      this.fillStyle = savefillStyle;
    }
  }

  draw() {
    let savefillStyle = ctx.fill;

    ctx.translate(this.pos.x, this.pos.y);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "16px Roboto";
    ctx.fillStyle = "white";
    ctx.fillText(this.name, 0, -this.size.h / 2 - 10);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(
      -this.size.w / 2,
      -this.size.h / 2,
      this.size.w,
      this.size.h
    );
    ctx.fillRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h);
    ctx.stroke();
    ctx.translate(-this.pos.x, -this.pos.y);

    this.fillStyle = savefillStyle;
  }

  movement() {
    // pressed

    if (keysPressed.includes("w")) this.moveToTop();

    if (keysPressed.includes("s")) this.moveToBottom();

    if (keysPressed.includes("a")) this.moveToLeft();

    if (keysPressed.includes("d")) this.moveToRight();

    // upped
    if (keysUpped.includes("w")) this.stopTopAndButtonMove();

    if (keysUpped.includes("s")) this.stopTopAndButtonMove();

    if (keysUpped.includes("a")) this.stopLeftAndRightMove();

    if (keysUpped.includes("d")) this.stopLeftAndRightMove();

    if (!document.hasFocus()) {
      this.stopLeftAndRightMove();
      this.stopTopAndButtonMove();
    }
  }

  getNameSize() {
    let savefont = ctx.font;
    ctx.font = this.font;
    const measure = ctx.measureText(this.name);

    ctx.font = savefont;

    return measure;
  }

  updateOtherPlayer() {}

  update() {
    if (this.other) {
      return this.updateOtherPlayer();
    }

    this.movement(); // movimentação do jogador

    const nameSize = this.getNameSize();

    const posXRef =
      nameSize.width > this.size.w ? nameSize.width / 2 : this.size.w / 2; // valor de referência para calcular as colisões nas bordas com o player para o clone

    const posYRef = (35 + this.size.h) / 2; // valor de referência para calcular as colisões nas bordas com o player para o clone

    // cria o clone do x quando ultrapassa o left
    if (this.pos.x - posXRef <= 0) {
      this.posClone.x = 1;
    }
    // cria o clone do x quando ultrapassa o right
    else if (this.pos.x + posXRef >= canvas.width) {
      this.posClone.x = -1;
    } else {
      this.posClone.x = "none";
    }

    // cria o clone do y quando ultrapassa o top
    if (this.pos.y - posYRef <= 0) {
      this.posClone.y = 1;
    }
    // cria o clone do y quando ultrapassa o bottom
    else if (this.pos.y + posYRef - 35 / 2 >= canvas.height) {
      this.posClone.y = -1;
    } else {
      this.posClone.y = "none";
    }

    // caso ultrapasse o corpo todo do player no left, ele cria remove o clone e muda a posição do jogador para o right
    if (this.pos.x + this.size.w / 2 <= 0) {
      this.pos.x = canvas.width - this.size.w / 2;
      this.posClone.x = "none";
    }

    // caso ultrapasse o corpo todo do player no right, ele cria remove o clone e muda a posição do jogador para o left
    if (this.pos.x - this.size.w / 2 >= canvas.width) {
      this.pos.x = this.size.w / 2;
      this.posClone.x = "none";
    }

    // caso ultrapasse o corpo todo do player no top, ele cria remove o clone e muda a posição do jogador para o bottom
    if (this.pos.y + this.size.h / 2 <= 0) {
      this.pos.y = canvas.height - this.size.h / 2;
      this.posClone.y = "none";
    }

    // caso ultrapasse o corpo todo do player no bottom, ele cria remove o clone e muda a posição do jogador para o top
    if (this.pos.y - this.size.h / 2 >= canvas.height) {
      this.pos.y = this.size.h / 2;
      this.posClone.y = "none";
    }

    if (this.dir.x === -1) {
      socket.emit("move left", {
        speed: this.speed,
        posClone: this.posClone,
      });
    } else if (this.dir.x === 1) {
      socket.emit("move right", {
        speed: this.speed,
        posClone: this.posClone,
      });
    }

    if (this.dir.y === -1) {
      socket.emit("move top", {
        speed: this.speed,
        posClone: this.posClone,
      });
    } else if (this.dir.y === 1) {
      socket.emit("move bottom", {
        speed: this.speed,
        posClone: this.posClone,
      });
    }

    this.pos.x += this.speed * this.dir.x;
    this.pos.y += this.speed * this.dir.y;
  }
}

let player;
let otherPlayers = [];

socket.on("player movement left", ({ x, name, posClone }) => {
  const el =
    otherPlayers[otherPlayers.findIndex((value) => value.name === name)];

  el.pos.x = x;
  el.posClone = posClone;
});

socket.on("player movement right", ({ x, name, posClone }) => {
  const el =
    otherPlayers[otherPlayers.findIndex((value) => value.name === name)];

  el.pos.x = x;
  el.posClone = posClone;
});

socket.on("player movement top", ({ y, name, posClone }) => {
  const el =
    otherPlayers[otherPlayers.findIndex((value) => value.name === name)];

  el.pos.y = y;
  el.posClone = posClone;
});

socket.on("player movement bottom", ({ y, name, posClone }) => {
  const el =
    otherPlayers[otherPlayers.findIndex((value) => value.name === name)];

  el.pos.y = y;
  el.posClone = posClone;
});

socket.on("player add", (p) => {
  otherPlayers.push(
    new Player(
      p.name,
      p.color,
      p.pos.x,
      p.pos.y,
      p.posClone.x,
      p.posClone.y,
      true
    )
  );
});

socket.on("player remove", ({ name }) => {
  const result = otherPlayers.splice(
    otherPlayers.findIndex((value) => value.name === name),
    1
  );
  console.log(result);
});

setups.push(() => {
  player = new Player(
    "você_" + globalState.current.name,
    globalState.current.color,
    globalState.current.pos.x,
    globalState.current.pos.y,
    globalState.current.posClone.x,
    globalState.current.posClone.y
  );

  otherPlayers = globalState.players.map((x) => {
    return new Player(
      x.name,
      x.color,
      x.pos.x,
      x.pos.y,
      x.posClone.x,
      x.posClone.y,
      true
    );
  });

  console.log(
    otherPlayers.findIndex((value) => value.name === otherPlayers[0].name)
  );
});

paints.push(() => {
  otherPlayers.forEach((x) => {
    x.draw();
    x.drawClone();
  });

  if (player) {
    player.draw();
    player.drawClone();
  }
});

updates.push(() => {
  if (player) {
    player.update();
  }

  otherPlayers.forEach((x) => {
    x.update();
  });
});
