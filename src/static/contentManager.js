'use strict'

import { handleExercises, deleteExercise, popupWrapper, workoutName, title, handleSaveBtn, handleEditBtn, startWorkout, addExercise } from "./workout.js";
import { putWorkout } from './dataHandler.js';
import { handleOptions, workoutList, handleOptionsBtn, handleNameChange, deleteWorkout } from './index.js'

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
        } else if (elem.classList.contains("darken-background")) {
            return elem.addEventListener("click", handleDarkenAnim);
        } else if (elem.id === "edit") {
            return elem.addEventListener("click", handleEditBtn);
        } else if (elem.id === "save") {
            return elem.addEventListener("click", handleSaveBtn);
        } else if (elem.id === "start") {
            return elem.addEventListener("click", startWorkout);
        } else if (elem.classList.contains("options")) {
            return elem.addEventListener("click", handleOptions);
        } else if (elem.classList.contains("workout")) {
            return elem.addEventListener("click", handleOptionsBtn);
        } else if (elem.id === "edit-name") {
            return elem.addEventListener("click", handleNameChange);
        } else if (elem.id === "delete-workout") {
            return elem.addEventListener("click", deleteWorkout);
        }
        elem.addEventListener("click", deleteExercise);
    }); 
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
