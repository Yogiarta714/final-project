// Search Bar Toggle
let navbar = document.querySelector('.navbar');
let searchBar = document.querySelector(".search-bar .fa-magnifying-glass");

// Ensure searchBar exists before adding event listener to avoid errors on pages without it
if (searchBar) {
    searchBar.addEventListener("click", () => {
        navbar.classList.toggle("showInput");

        if (navbar.classList.contains("showInput")) {
            searchBar.classList.replace("fa-magnifying-glass", "fa-x");
        } else {
            searchBar.classList.replace("fa-x", "fa-magnifying-glass");
        }
    });
}

// Menu Toggle
let menuIcon = document.querySelector('#menu-icon');
let menu = document.querySelector('.menu');

if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        menu.classList.toggle('active');

        // Toggle icon between bars and x
        if (menu.classList.contains('active')) {
            menuIcon.classList.replace("fa-bars", "fa-x");
        } else {
            menuIcon.classList.replace("fa-x", "fa-bars");
        }
    });
}