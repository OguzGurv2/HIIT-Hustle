'use strict'

let offsetX;
let isDraggingX = false;
let lastXPos;
let pageNum = 2;
let header = document.querySelector("h1");

const root = getComputedStyle(document.documentElement);
const secondaryColor = root.getPropertyValue('--secondary');
const textColor = root.getPropertyValue('--text');

const container = document.querySelector("#container");
let containerPosInPx = parseFloat(
    getComputedStyle(container).transform.split(",")[4]
    );
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let containerXPosInVw = (containerPosInPx / vw) * 100;

const pageList = document.querySelectorAll(".page");
const pages = Array.from(pageList).map((page) => page.id);

pages.forEach((id) => {
    const page = document.getElementById(id);

    page.addEventListener("touchstart", handleTouchStart);
    page.addEventListener("touchmove", handleTouchMove);
    page.addEventListener("touchend", endDrag);
});

const buttonList = document.querySelectorAll("i");
const buttons = Array.from(buttonList).map((button) => button.id);

buttons.forEach((id) => {
    const button = document.getElementById(id);

    button.addEventListener("click", buttonClicked);
});

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    offsetX = firstTouch.clientX;

    isDraggingX = true;
    lastXPos = 0;
}

function handleTouchMove(event) {
    if (!offsetX) return;

    const touch = event.touches[0];
    const distanceX = touch.clientX - offsetX;

    lastXPos = distanceX;

    if ((lastXPos < 0  && event.currentTarget.id != "settings") || 
    (lastXPos > 0 && event.currentTarget.id != "exercises")) {
        container.style.transform = `translateX(${containerPosInPx + lastXPos}px)`;
    }
}

function endDrag(event) {
    if (!isDraggingX) return;
    
    isDraggingX = false;

    if (lastXPos <= 100 && lastXPos > 0) {
        container.style.transform = `translateX(${containerXPosInVw}vw)`;

    } else if (lastXPos >= -100 && lastXPos < 0) {
        container.style.transform = `translateX(${containerXPosInVw}vw)`;

    } else if (lastXPos >= 100 && event.currentTarget.id != "exercises") {

        pageNum --;
        container.style.transform = `translateX(${containerXPosInVw + 100}vw)`;    
    } else if (lastXPos <= -100 && event.currentTarget.id != "settings") {

        pageNum ++;
        container.style.transform = `translateX(${containerXPosInVw - 100}vw)`;
    } else if (0 == lastXPos) {
        return;
    }

    updateContainerPos();
    updatePageElems(pageNum);
}

function buttonClicked(event) {
    container.style.transform = `translateX(${buttons.indexOf(event.currentTarget.id) * -100}vw)`;
    pageNum =  buttons.indexOf(event.currentTarget.id);

    updateContainerPos();
    updatePageElems(pageNum);
}

function updateContainerPos() {

    containerPosInPx = parseFloat(
        getComputedStyle(container).transform.split(",")[4]
    );
    containerXPosInVw = (containerPosInPx / vw) * 100;
}

function updatePageElems(pageNum) {
    for (let i = 0; i < pages.length; i++) {
        buttonList[i].style.color = textColor;
        if (i == pageNum) {
            header.textContent = `${pages[i]}`;
            buttonList[pageNum].style.color = secondaryColor;
        }   
    }
}
