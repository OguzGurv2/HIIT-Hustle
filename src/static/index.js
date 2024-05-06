"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // burger menu functionality for mobile
  const burgerMenuBtn = document.querySelector(".menu-icon");
  const burgerMenu = document.querySelector(".burger-menu");
  const closeMenuBtn = document.querySelector(".close-menu");

  burgerMenuBtn.addEventListener("click", () => {
    burgerMenu.style.display = "var(--fa-display, inline-block)";
  });

  closeMenuBtn.addEventListener("click", () => {
    burgerMenu.style.display = "none";
  });
});
