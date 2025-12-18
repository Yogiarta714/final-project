// board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

// bird
let birdWidth = boardWidth / 25;
let birdHeight = birdWidth * (34 / 44);
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImgs = [];
let birdImgsIndex = 0;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes (menggunakan linked list)
let pipeWidth = boardWidth / 12;
let pipeHeight = pipeWidth * (2072 / 450);
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -boardWidth / 250;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let wingSound = new Audio("../audio/sfx_wing.wav");
let hitSound = new Audio("../audio/sfx_hit.wav");
let pointSound = new Audio("../audio/sfx_point.wav");
let bgm = new Audio("../audio/bgm_mario.mp3");
bgm.loop = true;

// Linked List Implementation
class PipeNode {
  constructor(pipe, next = null) {
    this.pipe = pipe;
    this.next = next;
  }
}

class PipeLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(pipe) {
    const node = new PipeNode(pipe);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  removeOffScreenPipes() {
    while (this.head && this.head.pipe.x < -pipeWidth) {
      this.head = this.head.next;
    }
    if (!this.head) this.tail = null;
  }

  forEach(callback) {
    let current = this.head;
    while (current) {
      callback(current.pipe);
      current = current.next;
    }
  }
}

let pipeList = new PipeLinkedList();

window.addEventListener("resize", () => {
  boardWidth = window.innerWidth;
  boardHeight = window.innerHeight;
  board.width = boardWidth;
  board.height = boardHeight;
});

window.onload = function () {
  const headerHeight = document.getElementById("header").offsetHeight;
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  for (let i = 0; i < 4; i++) {
    let birdImg = new Image();
    birdImg.src = `../img/flappy-bird/flappybird${i}.png`;
    birdImgs.push(birdImg);
  }

  topPipeImg = new Image();
  topPipeImg.src = "../img/flappy-bird/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "../img/flappy-bird/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  setInterval(animateBird, 100);
  document.addEventListener("keydown", moveBird);
  board.addEventListener("click", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) return;

  context.clearRect(0, 0, board.width, board.height);

  // bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImgs[birdImgsIndex], bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  // pipes
  pipeList.forEach((pipe) => {
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipeHeight);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
      if (score % 10 === 0) {
        pointSound.play();
      }
    }

    if (detectCollision(bird, pipe)) {
      hitSound.play();
      gameOver = true;
    }
  });

  pipeList.removeOffScreenPipes();

  // score
  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.strokeText(score, boardWidth / 2, boardHeight / 6);
  context.fillStyle = "white";
  context.font = "60px sans-serif";
  context.fillText(score, boardWidth / 2, boardHeight / 6);

  if (gameOver) {
    context.strokeText("GAME OVER", boardWidth / 2.65, boardHeight / 3.5);
    context.fillText("GAME OVER", boardWidth / 2.65, boardHeight / 3.5);
    bgm.pause();
    bgm.currentTime = 0;
  }
}

function animateBird() {
  birdImgsIndex = (birdImgsIndex + 1) % birdImgs.length;
}

function placePipes() {
  if (gameOver) return;

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 3;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeList.append(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeList.append(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type === "click") {
    if ((e.code === "Space", "ArrowUp")) {
      e.preventDefault();
    }

    if (bgm.paused) {
      bgm.play();
    }

    wingSound.play();
    velocityY = -6;

    if (gameOver) {
      bird.y = birdY;
      pipeList = new PipeLinkedList();
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
