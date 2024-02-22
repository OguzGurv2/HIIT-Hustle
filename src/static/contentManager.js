'use strict'

import { addExerciseToWorkout } from "./workoutHandler.js";

export function fixContentLength(bool) {
    
    let children;
    if (bool) {
        children = document.querySelector('#workout-content').childNodes;
    } else {
        children = document.querySelectorAll('.child');
    }

    let maxHeight = 0;
    children.forEach(child => {
        maxHeight = Math.max(maxHeight, child.offsetHeight);
    });

    const vhMaxHeight = (maxHeight / window.innerHeight) * 100;

    children.forEach(child => {
        child.style.height = vhMaxHeight + 'vh';
    });


};

export function addClickEventToContent() {
    const children = document.querySelectorAll('.child');
    
    children.forEach(child => {
        child.addEventListener("click", addExerciseToWorkout);
    });
}
