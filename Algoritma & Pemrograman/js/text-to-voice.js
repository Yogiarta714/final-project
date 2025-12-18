let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[0];

  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );
};

voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

document.querySelector("button").addEventListener("click", () => {
  speech.text = document.querySelector("textarea").value;
  window.speechSynthesis.speak(speech);
});

const dropdown = document.getElementById("dropdown");

dropdown.addEventListener("click", function () {
  // Toggle class 'open' pada elemen dropdown
  if (dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
  } else {
    dropdown.classList.add("open");
  }
});

// Hilangkan class 'open' jika dropdown kehilangan fokus
dropdown.addEventListener("blur", function () {
  dropdown.classList.remove("open");
});
