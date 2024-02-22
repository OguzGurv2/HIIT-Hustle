'use strict';

import { fixContentLength } from "./contentManager.js";

export function addExerciseToWorkout(event) {
    const popupMsg = document.querySelector('#popup-msg');
    
    document.querySelector('#workout-content').appendChild(event.currentTarget.cloneNode(true));
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);

    fixContentLength(true);
}
