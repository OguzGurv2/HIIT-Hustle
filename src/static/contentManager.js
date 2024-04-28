'use strict'

import { popupWrapper, handleEditBtn, handleAddExerciseBtn, startWorkoutSession, pauseWorkoutSession } from "./workout.js";
import { handleNameChange, createNewWorkout, deleteWorkout, handleNameInput } from './index.js'

export function addEventListenersToContents(elem) {

    const handleEvent = () => {
        switch (elem.id) {
            case "create-workout":
                elem.addEventListener("click", createNewWorkout);
                break;
            case "delete-workout":
                elem.addEventListener("click", deleteWorkout);
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
            case "start":
                elem.addEventListener("click", startWorkoutSession);
                break;
            case "pause":
                elem.addEventListener("click", pauseWorkoutSession);
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
    const privacyText = document.querySelector(".policy-text");
    darkenBg.classList.toggle("hidden");
    const param = window.location.pathname;

    if (param === "/workout.html") {
        popupWrapper.classList.add("hidden");
        
    } else {
        const btnWrapper = document.querySelector(".button-wrapper");
        privacyText.classList.remove("active");
        btnWrapper.style.display = "none";
    }
    popupName.style.display = "none";
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

export function createInstructions(data, container) {
    const paragraphs = data.description.split(/\d+\.\s/);
    for (let i = 1; i < paragraphs.length; i++) {
        const newParagraph = document.createElement('p');
        newParagraph.classList.add("exercise-p");
        newParagraph.textContent = `${i}. ${paragraphs[i]}`;
        container.appendChild(newParagraph);
    }
}