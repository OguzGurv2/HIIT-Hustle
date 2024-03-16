'use strict'

import { deleteExercise, popupWrapper, workoutName, title, handleSaveBtn, handleEditBtn, startWorkout, handleAddExerciseBtn, addExerciseToWorkout } from "./workout.js";
import { putWorkout } from './dataHandler.js';
import { handleOptions, workoutList, handleOptionsBtn, handleNameChange, deleteWorkout } from './index.js'

export function addEventListenersToContents(elem) {

    if (elem.id === "popup-grid") {
        elem.childNodes.forEach(child => {
            child.addEventListener("click", addExerciseToWorkout);
        });
        return;
    }

    const handleEvent = () => {
        switch (elem.id) {
            case "name-input":
                elem.addEventListener("keydown", handleNameInput);
                break;
            case "add-exercise":
                elem.addEventListener("click", handleAddExerciseBtn);
                break;
            case "edit":
                elem.addEventListener("click", handleEditBtn);
                break;
            case "save":
                elem.addEventListener("click", handleSaveBtn);
                break;
            case "start":
                elem.addEventListener("click", startWorkout);
                break;
            case "edit-name":
                elem.addEventListener("click", handleNameChange);
                break;
            case "delete-workout":
                elem.addEventListener("click", deleteWorkout);
                break;
            default:
                if (elem.classList.contains("darken-background")) {
                    elem.addEventListener("click", handleDarkenAnim);
                } else if (elem.classList.contains("options")) {
                    elem.addEventListener("click", handleOptions);
                } else if (elem.classList.contains("workout")) {
                    elem.addEventListener("click", handleOptionsBtn);
                } else {
                    elem.addEventListener("click", deleteExercise);
                }
                break;
        }
    };
    elem.addEventListener("click", handleEvent); 
}

export function handleDarkenAnim() {
    const darkenBg = document.querySelector(".darken-background");
    const popupName = document.querySelector(".popup-name");

    darkenBg.classList.toggle("hidden");
    const param = window.location.pathname;
        
    if (param === "/workout.html") {
        popupWrapper.classList.add("hidden");
    } else {
        const btnWrapper = document.querySelector(".button-wrapper");
        btnWrapper.style.display = "none";
    }
    popupName.style.display = "none";
}

export function handleNameInput(event) {
    const darkenBg = document.querySelector(".darken-background");
    const popupName = document.querySelector(".popup-name");
    const btnWrapper = document.querySelector(".button-wrapper");
    
    if (event.key === "Enter") {
        
        darkenBg.classList.add("hidden");
        popupName.style.display = "none";
        
        const editedName = capitalizeWords(event.target.value.split(/-/));
        const param = window.location.pathname;
        
        if (param === "/workout.html") {
            workoutName.textContent = editedName;
            title.textContent = editedName;
        } else {
            putWorkout(btnWrapper.id, "update", editedName);
            msgAnim("Workout name changed!");
                
            workoutList.forEach(workout => {
                if (workout.id === btnWrapper.id) {
                    workout.querySelector('p').textContent = editedName;
                };
            });
        };
    };
}

export function msgAnim(param) {
    const popupMsg = document.querySelector('.popup-msg');
    
    popupMsg.textContent = param;
    
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);
}

export function fixContentLength(nodeList) {
    let maxHeight = 0;
    nodeList.forEach(child => {
        maxHeight = Math.max(maxHeight, child.offsetHeight);
    });

    const vhMaxHeight = (maxHeight / window.innerHeight) * 100;

    nodeList.forEach(child => {
        child.style.height = vhMaxHeight + 'vh';
    });
};

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

export function getNodeListIds(nodeList) {
    const ids = [];
    nodeList.forEach(node => {
        ids.push(node.id);
    });
    return ids;
}

export function findWorkoutByID(event) {
    return Array.prototype.find.call(workoutList, workout => workout.id === event.target.parentNode.id);
}

export function findExerciseID(elem) {
    if (elem.id) {
        return elem.id;
    } 
    return elem.parentNode.id;
}
