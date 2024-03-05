'use strict';

import { addEventListenersToContents, fixContentLength } from "./contentManager.js";
import { popupMsg } from "./workout.js";
import { isSaved } from "./buttonHandler.js";

let exerciseAdded = false;
let workoutCon = document.querySelector('#workout-content');

export function handleExercises(param) {
    let clonedExercise;

    if (param.currentTarget) {
        clonedExercise = param.currentTarget.cloneNode(true)
        
        popupMsg.textContent = "Exercise Added!";
        popupMsg.classList.remove('animate-down');
        popupMsg.classList.add('animate-up');
        
        setTimeout(() => {
            popupMsg.classList.remove('animate-up');
            popupMsg.classList.add('animate-down');
        }, 1500);

    } else {
        clonedExercise = document.getElementById(param).cloneNode(true);
    }

    const deleteExercise = document.createElement("div");
    deleteExercise.classList.add("delete-exercise");
    deleteExercise.classList.add("hidden");
    deleteExercise.textContent = "X";

    clonedExercise.appendChild(deleteExercise);
    workoutCon.appendChild(clonedExercise);

    fixContentLength(true);
    handleSaveBtn();
    addEventListenersToContents(clonedExercise);
}

function handleSaveBtn() {
    workoutCon = document.querySelector('#workout-content');
    if (workoutCon.childNodes.length > 0 && !isSaved) {
        document.querySelector("#save").classList.remove('hidden');
        exerciseAdded = true;
        return;
    };
    document.querySelector("#save").classList.add('hidden');
}

export function handleDelete(event) {
    event.target.parentNode.remove();
    workoutCon = document.querySelector('#workout-content');

    popupMsg.textContent = "Exercise Deleted!";
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);
    handleSaveBtn();
}


export { exerciseAdded, workoutCon };
