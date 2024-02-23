'use strict'

import { addExerciseToWorkout, handleDelete } from "./workoutHandler.js";
import { handleDarkenAnim, handleEditBtn, handleNameInput, handlePopupBtn, handleSave } from "./buttonHandler.js";

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

export function addEventListenersToContents(elem) {
    if (elem.id === "popup-grid") {
        return elem.childNodes.forEach(child => {
            child.addEventListener("click", addExerciseToWorkout);
        });
    }

    elem.addEventListener("click", ()=> {
        if (elem.id === "name-input") {
            return elem.addEventListener("keydown", handleNameInput);
        } else if (elem.id === "popup-btn") {
            return elem.addEventListener("click", handlePopupBtn);
        } else if (elem.id === "darken-background") {
            return elem.addEventListener("click", handleDarkenAnim);
        } else if (elem.id === "edit") {
            return elem.addEventListener("click", handleEditBtn);
        } else if (elem.id === "save") {
            return elem.addEventListener("click", handleSave);
        }
        elem.addEventListener("click", handleDelete);
    }); 
}
