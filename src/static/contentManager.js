'use strict'

import { handleExercises, handleDelete } from "./workoutHandler.js";
import { handleDarkenAnim, handleEditBtn, handleNameInput, addExercise, handleSave } from "./buttonHandler.js";

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
            child.addEventListener("click", handleExercises);
        });
    }

    elem.addEventListener("click", ()=> {
        if (elem.id === "name-input") {
            return elem.addEventListener("keydown", handleNameInput);
        } else if (elem.id === "add-exercise") {
            return elem.addEventListener("click", addExercise);
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

export function capitalizeWords(words) {
    let editedName = words.map((word) => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    }).join(" ");
  
    return editedName;
}
