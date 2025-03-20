const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

// Mereset semua variabel game dan UI elements
const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = `../img/hangman/hangman-${wrongGuessCount}.svg`;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  keyboardDiv
    .querySelectorAll("button")
    .forEach((btn) => (btn.disabled = false));
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  gameModal.classList.remove("show");
};
// untuk seleksi kata acak dan hint dari wordList
const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  // console.log(word);
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
};

// Setelah game selesai, memperlihatkan modal dengan detail yang relevan
const gameOver = (isVictory) => {
  setTimeout(() => {
    const modalText = isVictory
      ? `Kamu menemukan kata:`
      : `Jawaban yang benar adalah:`;
    gameModal.querySelector("img").src = `../img/hangman/${
      isVictory ? `victory` : `lost`
    }.gif`;
    gameModal.querySelector("h4").innerText = `${
      isVictory ? `Selamat!` : `Game Over!`
    }`;
    gameModal.querySelector(
      "p"
    ).innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
  }, 300);
};

// untuk cek clickedLetter sesuai dengan kata yang ditampilkan
const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    // Untuk melihat jawaban benar pada tampilan kata
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    });
  } else {
    // ketika tebakan yang diklik tidak benar akan perbarui wrongGuessCount dan hangman image
    wrongGuessCount++;
    hangmanImage.src = `../img/hangman/hangman-${wrongGuessCount}.svg`;
  }
  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  // Memanggil fungsi gameOver ketika kondisi terpenuhi
  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (correctLetters.length === currentWord.length) return gameOver(true);
};

// Membuat tombol keyboard
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) =>
    initGame(e.target, String.fromCharCode(i))
  );
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
