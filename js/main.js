// Toggle class active
const navbar = document.querySelector("#navbar");
// Ketika menu di klik
document.querySelector("#bar").onclick = () => {
  navbar.classList.toggle("active");
};

// Klik diluar sidebar untuk tutup bar
const bar = document.querySelector("#bar");
document.addEventListener("click", function (e) {
  if (!bar.contains(e.target) && !navbar.contains(e.target)) {
    navbar.classList.remove("active");
  }
});
