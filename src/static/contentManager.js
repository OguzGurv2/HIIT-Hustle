'use strict'

import { handleExercises, handleDelete, popupWrapper, workoutName, title, isSaved, isUpdated, handleSaveParam, workoutParam } from "./workout.js";
import { sendWorkout, putWorkout } from './dataHandler.js';
import { handleOptions, btnWrapper, nameInput } from './index.js'

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
            return elem.addEventListener("click", handleWorkouts);
        } else if (elem.id === "edit-name") {
            return elem.addEventListener("click", handleNameChange);
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

function handleWorkouts(event) {
    if (!event.target.classList.contains("options") && !event.target.parentNode.classList.contains("options")) {
        window.location.href = `workout.html?workout=${event.target.id}`;
    }
}

export function handleDarkenAnim() {
    const darkenBg = document.querySelector(".darken-background");
    const popupName = document.querySelector(".popup-name");

    darkenBg.classList.toggle("hidden");
    const param = localStorage.getItem("pageName");
    if (param == "workout") {
        popupWrapper.classList.add("hidden");
    } else {
        btnWrapper.style.display = "none";

    }
    popupName.style.display = "none";
}

function handleNameChange(event) {
    const popupName = document.querySelector(".popup-name");
    btnWrapper.style.display = "none";
    popupName.style.display = "flex";
    nameInput.placeholder = event.target.parentNode.id;
}

export function handleNameInput(event) {
    const darkenBg = document.querySelector(".darken-background");
    const popupName = document.querySelector(".popup-name");
    
    if (event.key === "Enter") {
        
        darkenBg.classList.add("hidden");
        popupName.style.display = "none";
        
        const editedName = capitalizeWords(event.target.value.split(/-/));
        const param = localStorage.getItem("pageName");
        
        if (param == "workout") {
            workoutName.textContent = editedName;
            title.textContent = editedName;
        } else {
            console.log(btnWrapper.id);
        }
    }
}

export function addExercise() {
    const darkenBg = document.querySelector(".darken-background");

    darkenBg.classList.remove("hidden");
    popupWrapper.classList.remove("hidden");
  
    if (isUpdated || isSaved) {
      document.querySelectorAll(".delete-exercise").forEach((elem) => {
        elem.classList.add("hidden");
      });
    }
}


export function handleEditBtn() {
    if (isUpdated || isSaved) {
        document.querySelectorAll(".delete-exercise").forEach((elem) => {
            elem.classList.toggle("hidden");
        });
    }
}

export function handleSaveBtn(event) {
    const workoutName = document.querySelector('.nav-header').textContent;
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
