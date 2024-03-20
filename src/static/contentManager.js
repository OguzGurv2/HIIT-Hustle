'use strict'

import { popupWrapper, workoutName, title, handleEditBtn, handleAddExerciseBtn, workoutParam } from "./workout.js";
import { putWorkout } from './dataHandler.js';
import { handleNameChange, createNewWorkout } from './index.js'

export function addEventListenersToContents(elem) {

    const handleEvent = () => {
        switch (elem.id) {
            case "create-workout":
                elem.addEventListener("click", createNewWorkout);
                break;
            case "name-input":
                elem.addEventListener("keydown", handleNameInput);
                break;
            case "add-exercise":
                elem.addEventListener("click", handleAddExerciseBtn);
                break;
            case "edit":
                elem.addEventListener("click", handleEditBtn);
                break;
            case "edit-name":
                elem.addEventListener("click", handleNameChange);
                break;
            default:
                if (elem.classList.contains("darken-background")) {
                    elem.addEventListener("click", handleDarkenAnim);
                }
                break;
        }
    };
    document.addEventListener("DOMContentLoaded", handleEvent()); 
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
            putWorkout(workoutParam, "update", editedName);
        } else {
            putWorkout(btnWrapper.id, "update", editedName);
            msgAnim("Workout name changed!");
                
            const workoutList = document.querySelector('.row-grid').childNodes;
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

export function findWorkoutByID(event) {
    const workoutList = document.querySelector('.row-grid').childNodes;
    return Array.prototype.find.call(workoutList, workout => workout.id === event.target.parentNode.id);
}
