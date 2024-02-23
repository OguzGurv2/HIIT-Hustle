'use strict';

import { addEventListenersToContents, fixContentLength } from "./contentManager.js";
import { workoutCon, popupMsg, exerciseAdded } from "./workout.js";

export function addExerciseToWorkout(event) {
        
    const clonedExercise = event.currentTarget.cloneNode(true)

    const deleteExercise = document.createElement("div");
    deleteExercise.classList.add("delete-exercise");
    deleteExercise.classList.add("hidden");
    deleteExercise.textContent = "X";

    clonedExercise.appendChild(deleteExercise);
    workoutCon.appendChild(clonedExercise);

    popupMsg.textContent = "Exercise Added!";
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);

    fixContentLength(true);
    handleSaveBtn();
    addEventListenersToContents(clonedExercise);
}

function handleSaveBtn() {
    if(workoutCon.childNodes.length > 0) {
        document.querySelector("#save").classList.remove('hidden');
        return exerciseAdded = true;
    }
    exerciseAdded = false;
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
