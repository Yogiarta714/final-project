// Search Bar Toggle
let navbar = document.querySelector('.navbar');
let searchBar = document.querySelector(".search-bar .fa-magnifying-glass");
{/* <i class="fa-solid fa-x"></i>; */}
searchBar.addEventListener("click", () => {
  navbar.classList.toggle("showInput");

  if (navbar.classList.contains("showInput")) {
    searchBar.classList.replace("fa-magnifying-glass", "fa-x");
  } else {
    searchBar.classList.replace("fa-x", "fa-magnifying-glass");
  }
})