let offsetX;
let isDragging = false;
let lastXPos;

const nodeList = document.querySelectorAll(".page");
const pages = Array.from(nodeList).map(page => page.id);

pages.forEach(id => {
    const page = document.getElementById(id);

    page.addEventListener('touchstart', handleTouchStart);
    page.addEventListener('touchmove', handleTouchMove);
    page.addEventListener('touchend', endDrag);
});

function handleTouchStart(event) {

    const firstTouch = event.touches[0];
    offsetX = firstTouch.clientX;

    isDragging = true;
}

function handleTouchMove(event) {
    if (!offsetX) return;

    const touch = event.touches[0];
    const distanceX = touch.clientX - offsetX;

    lastXPos = distanceX;    

}

function endDrag() {
    if (!isDragging) return;

    const container = document.querySelector(".container");
    const currentX = parseFloat(getComputedStyle(container).transform.split(',')[4]);
    console.log(currentX);

    isDragging = false;
    
    if (lastXPos >= 100 && currentX != 0) {

        const newX = currentX + 430;
        container.style.transform = `translateX(${newX}px)`;
    } else if (lastXPos <= -100 && currentX != -1720) {

        const newX = currentX - 430;
        container.style.transform = `translateX(${newX}px)`;
    }
}
