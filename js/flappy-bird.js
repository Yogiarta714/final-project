// board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

// bird
let birdWidth = boardWidth / 25; // Adjust bird size relative to screen
let birdHeight = birdWidth * (34 / 44); // Maintain aspect ratio
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

// pipes
let pipeArray = [];
let pipeWidth = boardWidth / 12;
let pipeHeight = pipeWidth * (2072 / 450);
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -boardWidth / 250; // Kecepatan berdasarkan lebar layar
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

let wingSound = new Audio("../audio/sfx_wing.wav");
let hitSound = new Audio("../audio/sfx_hit.wav");
let pointSound = new Audio("../audio/sfx_point.wav");
let bgm = new Audio("../audio/bgm_mario.mp3");
bgm.loop = true;

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
  context = board.getContext("2d"); //untuk menggambar board

  // loop animasi burung
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
  setInterval(placePipes, 1500); //setiap 1.5 detik
  setInterval(animateBird, 100); //setiap 0.1 detik
  document.addEventListener("keydown", moveBird);
  board.addEventListener("click", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); //memberikan gravity untuk posisi bird.y sekarang, limit posisi bird.y sampai posisi paling atas canvas
  context.drawImage(
    birdImgs[birdImgsIndex],
    bird.x,
    bird.y,
    bird.width,
    bird.height
  );
  // birdImgsIndex++; //increment to next frame
  // birdImgsIndex %= birdImgs.length; //pengulangan dengan modulus, max frames is 4
  // 0 1 2 3 0 1 2 3 0 1 2 3...

  if (bird.y > board.height) {
    gameOver = true;
  }

  // pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX; //setiap load pipe nya, akan terus bergerak ke kiri
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipeHeight);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 karena ada 2 pipa (atas dan bawah), jadi 0.5*2 = 1, 1 untuk setiap set
      pipe.passed = true;

      // Memutar suara hanya ketika skor adalah kelipatan 10
      if (score % 10 === 0) {
        pointSound.play();
      }
    }

    if (detectCollision(bird, pipe)) {
      hitSound.play();
      gameOver = true;
    }
  }

  // clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); // menghapus elemen pertama di array
  }

  // score
  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.strokeText(score, boardWidth / 2, boardHeight / 6);
  context.fillStyle = "white";
  context.font = "60px sans-serif";
  context.fillText(score, boardWidth / 2, boardHeight / 6);

  if (gameOver) {
    context.strokeStyle = "black";
    context.lineWidth = 5;
    context.strokeText("GAME OVER", boardWidth / 2.65, boardHeight / 3.5);
    context.fillStyle = "white";
    context.font = "60px sans-serif";
    context.fillText("GAME OVER", boardWidth / 2.65, boardHeight / 3.5);
    bgm.pause();
    bgm.currentTime = 0;
  }
}

function animateBird() {
  birdImgsIndex++; //increment to next frame
  birdImgsIndex %= birdImgs.length; //pengulangan dengan modulus, max frames is 4
}

function placePipes() {
  if (gameOver) {
    return;
  }
  //(0-1) * pipeHeight/2
  // 0 => -128 (pipeHeight/4)
  // 1=> -128 -256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 3; // Celah antar pipa 1/3 dari tinggi layar

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

// function untuk menangani cara bermain user
function moveBird(e) {
  if (
    e.code == "Space" ||
    e.code == "ArrowUp" ||
    e.code == "KeyX" ||
    e.type === "click"
  ) {
    // Mencegah scroll halaman saat spasi ditekan
    if ((e.code === "Space", "ArrowUp")) {
      e.preventDefault();
    }

    if (bgm.paused) {
      bgm.play();
    }
    bgm.play();
    wingSound.play();
    //jump
    velocityY = -6;

    // reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
