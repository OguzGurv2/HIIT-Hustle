'use strict';

import { addEventListenersToContents, fixContentLength } from "./contentManager.js";
import { popupMsg, isUpdated, handleUpdateParam } from "./workout.js";

let workoutCon = document.querySelector('#workout-content');

export function handleExercises(param) {
    workoutCon = document.querySelector('#workout-content');
    const clonedExercise = param.currentTarget.cloneNode(true)
        
    popupMsg.textContent = "Exercise Added!";
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);

    workoutCon.appendChild(clonedExercise);
    handleUpdateParam(true);
    const childList = document.querySelectorAll("child");
    fixContentLength(childList);
    handleSave();
    addEventListenersToContents(clonedExercise);
}

function handleSave() {
    workoutCon = document.querySelector('#workout-content');
    if (workoutCon.childNodes.length > 0 && isUpdated) {
        document.querySelector("#save").classList.remove('hidden');
        handleUpdateParam(true);
        return;
    };
    document.querySelector("#save").classList.add('hidden');
}

export function handleDelete(event) {
    workoutCon = document.querySelector('#workout-content');
    console.log(event.target.parentNode);
    event.target.parentNode.remove();

    popupMsg.textContent = "Exercise Deleted!";
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);
    handleSave();
}
