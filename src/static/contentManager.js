'use strict'

function fixContentLength() {
    const children = document.querySelectorAll('.child');

    let maxHeight = 0;
    children.forEach(child => {
        maxHeight = Math.max(maxHeight, child.offsetHeight);
    });

    const vhMaxHeight = (maxHeight / window.innerHeight) * 100;

    children.forEach(child => {
        child.style.height = vhMaxHeight + 'vh';
    });
};

export { fixContentLength };
