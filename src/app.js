let offsetX;
let isDragging = false;
let lastXPos;
let pageNum = 2;

let header = document.querySelector("h1");
const nodeList = document.querySelectorAll(".page");
const pages = Array.from(nodeList).map((page) => page.id);

const container = document.querySelector("#container");
let containerPosInPx = parseFloat(
    getComputedStyle(container).transform.split(",")[4]
    );
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let containerPosInVw = (containerPosInPx / vw) * 100;

pages.forEach((id) => {
    const page = document.getElementById(id);

    page.addEventListener("touchstart", handleTouchStart);
    page.addEventListener("touchmove", handleTouchMove);
    page.addEventListener("touchend", endDrag);
});

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    offsetX = firstTouch.clientX;

    isDragging = true;
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
    if (!isDragging) return;
    
    isDragging = false;

    if (lastXPos >= 100 && event.currentTarget.id != "exercises") {

        pageNum --;
        container.style.transform = `translateX(${containerPosInVw + 100}vw)`;    
    } else if (lastXPos <= -100 && event.currentTarget.id != "settings") {

        pageNum ++;
        container.style.transform = `translateX(${containerPosInVw - 100}vw)`;
    } else if (0 == lastXPos) {
        return;
    }

    updateContainerPos();
    updateHeader(pageNum);
}

function updateContainerPos() {

    if (lastXPos <= 100 && lastXPos > 0) {
        container.style.transform = `translateX(${containerPosInVw}vw)`;
    } else if (lastXPos >= -100 && lastXPos < 0) {
        container.style.transform = `translateX(${containerPosInVw}vw)`;
    }
    containerPosInPx = parseFloat(
        getComputedStyle(container).transform.split(",")[4]
    );
    containerPosInVw = (containerPosInPx / vw) * 100;
}

function updateHeader(pageNum) {
    pages.forEach(page => {
        if (pages.indexOf(page) == pageNum) {
            header.textContent = `${page}`;
        }
    });
}
