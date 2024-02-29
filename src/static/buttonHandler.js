'use strict'

import { darkenBg, popupWrapper, popupName, workoutName, title } from './workout.js';
import { exerciseAdded } from './workoutHandler.js';
import { sendWorkout } from './dataHandler.js';

export function handleNameInput(event) {

    if (event.key === "Enter") {
        darkenBg.classList.add("hidden");
        popupName.style.display = "none";
        title.textContent = event.target.value;
        workoutName.textContent = event.target.value;
    }
}

export function handlePopupBtn() {
    darkenBg.classList.remove("hidden");
    popupWrapper.classList.remove("hidden");
  
    if (exerciseAdded) {
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
    if (exerciseAdded) {
        document.querySelectorAll(".delete-exercise").forEach((elem) => {
            elem.classList.toggle("hidden");
        });
    }
}

export function handleSave() {
    const workoutName = document.querySelector('.exercise-header').textContent;
    const nodeList = document.querySelector('#workout-content').childNodes;
    const exerciseList = getNodeListIds(nodeList);
    sendWorkout(workoutName, exerciseList);
}

function getNodeListIds(nodeList) {
    const ids = [];
    nodeList.forEach(node => {
        ids.push(node.id);
    });
    return ids;
}
