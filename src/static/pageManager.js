"use strict";

let offsetX;
let isDraggingX = false;
let lastXPos;
let pageNum = 2;
let header = document.querySelector("h1");

// gets the section for sliding
const container = document.querySelector("section");
let containerPosInPx = parseFloat(
  getComputedStyle(container).transform.split(",")[4]
);

// calculates vw
const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
let containerXPosInVw = (containerPosInPx / vw) * 100;

// gets "pages" inside the html
const pageList = document.querySelectorAll(".page");
const pages = Array.from(pageList).map((page) => page.id);

// shows the last "page" after relocating to home.html
document.addEventListener("DOMContentLoaded", () => {
  let storedData = localStorage.getItem("pageIndex");

  if (storedData) {
    pageNum = storedData;
    localStorage.removeItem("pageIndex");
  }

  container.style.transform = `translateX(${pageNum * -100}vw)`;

  updateContainerPos();
  updatePageElems(pageNum);
});

// event listeners for "pages"
pages.forEach((id) => {
  const page = document.getElementById(id);

  page.addEventListener("touchstart", handleTouchStart);
  page.addEventListener("touchmove", handleTouchMove);
  page.addEventListener("touchend", endDrag);
});

// event listeners for "page" buttons
const buttonList = document.querySelectorAll(".btn");
const buttons = Array.from(buttonList).map((button) => button.id);

buttons.forEach((id) => {
  const button = document.getElementById(id);

  button.addEventListener("click", buttonClicked);
});

const secondButtonList = document.querySelectorAll(".btn2");
const buttons2 = Array.from(secondButtonList).map((button) => button.id);

buttons2.forEach((id) => {
  const button = document.getElementById(id);

  button.addEventListener("click", buttonClicked);
});

// handles touch start
function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  offsetX = firstTouch.clientX;

  isDraggingX = true;
  lastXPos = 0;
}

// handles touch move
function handleTouchMove(event) {
  if (!offsetX) return;

  const touch = event.touches[0];
  const distanceX = touch.clientX - offsetX;

  lastXPos = distanceX;

  if (
    (lastXPos < 0 && event.currentTarget.id != "settings") ||
    (lastXPos > 0 && event.currentTarget.id != "exercises")
  ) {
    container.style.transform = `translateX(${containerPosInPx + lastXPos}px)`;
  }
}

// ends the drag and depending of the drag value changes the "page"
function endDrag(event) {
  if (!isDraggingX) return;

  isDraggingX = false;

  if (lastXPos <= 100 && lastXPos > 0) {
    container.style.transform = `translateX(${containerXPosInVw}vw)`;
  } else if (lastXPos >= -100 && lastXPos < 0) {
    container.style.transform = `translateX(${containerXPosInVw}vw)`;
  } else if (lastXPos >= 100 && event.currentTarget.id != "exercises") {
    pageNum--;
    container.style.transform = `translateX(${containerXPosInVw + 100}vw)`;
  } else if (lastXPos <= -100 && event.currentTarget.id != "settings") {
    pageNum++;
    container.style.transform = `translateX(${containerXPosInVw - 100}vw)`;
  } else if (0 == lastXPos) {
    return;
  }

  updateContainerPos();
  updatePageElems(pageNum);
}

// changes "page" according the button
function buttonClicked(event) {
  if (event.currentTarget.tagName === "BUTTON") {
    container.style.transform = `translateX(${
      buttons2.indexOf(event.currentTarget.id) * -100
    }vw)`;
    pageNum = buttons2.indexOf(event.currentTarget.id);
  } else {
    container.style.transform = `translateX(${
      buttons.indexOf(event.currentTarget.id) * -100
    }vw)`;
    pageNum = buttons.indexOf(event.currentTarget.id);
  }

  updateContainerPos();
  updatePageElems(pageNum);
}

// updates section's position for future functions
function updateContainerPos() {
  containerPosInPx = parseFloat(
    getComputedStyle(container).transform.split(",")[4]
  );
  containerXPosInVw = (containerPosInPx / vw) * 100;
}

// updates the content of button to show them as selected
function updatePageElems(pageNum) {
  for (let i = 0; i < pages.length; i++) {
    if (i == pageNum) {
      header.textContent = `${pages[i]}`;
      buttonList[pageNum].classList.add("selected");
    } else {
      buttonList[i].classList.remove("selected");
    }
  }
}
