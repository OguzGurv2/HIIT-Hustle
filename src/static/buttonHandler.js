'use strict'

import { darkenBg, popupWrapper, popupName, workoutName, title, isSaved, isUpdated, handleSaveParam, workoutParam } from './workout.js';
import { sendWorkout, putWorkout } from './dataHandler.js';

export function handleNameInput(event) {

    if (event.key === "Enter") {
        darkenBg.classList.add("hidden");
        popupName.style.display = "none";
        title.textContent = event.target.value;
        workoutName.textContent = event.target.value;
    }
}

export function addExercise() {
    darkenBg.classList.remove("hidden");
    popupWrapper.classList.remove("hidden");
  
    if (isUpdated || isSaved) {
      document.querySelectorAll(".delete-exercise").forEach((elem) => {
        elem.classList.add("hidden");
      });
    }
}

export function handleDarkenAnim() {
    darkenBg.classList.add("hidden");
    popupWrapper.classList.add("hidden");
    popupName.style.display = "none";
}

export function handleEditBtn() {
    if (isUpdated || isSaved) {
        document.querySelectorAll(".delete-exercise").forEach((elem) => {
            elem.classList.toggle("hidden");
        });
    }
}

export function handleSaveBtn(event) {
    const workoutName = document.querySelector('.exercise-header').textContent;
    const nodeList = document.querySelector('#workout-content').childNodes;
    const exerciseList = getNodeListIds(nodeList);
    event.target.classList.add('hidden');

    if (!isSaved) {
        handleSaveParam();
        return sendWorkout(workoutName, exerciseList);
    } 
    putWorkout(workoutName, exerciseList);
}

function getNodeListIds(nodeList) {
    const ids = [];
    nodeList.forEach(node => {
        ids.push(node.id);
    });
    return ids;
}

export function startWorkout() {
    window.location.href = `startWorkout.html?workout=${workoutParam}`;
}