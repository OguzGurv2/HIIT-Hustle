'use strict'

import { popupWrapper, handleEditBtn, handleAddExerciseBtn, startWorkoutSession, pauseWorkoutSession, workoutParam, userID } from "./workout.js";
import { handleNameChange, createNewWorkout, deleteWorkout, Workout, WorkoutData } from './home.js';
import { putWorkout } from "./dataHandler.js";

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
                if (elem.classList.contains("nav-btn")) {
                    elem.addEventListener("click", handleNavBtn);
                }
                break;
        }
    };
    document.addEventListener("DOMContentLoaded", handleEvent()); 
}

function handleNavBtn() {
    const userID = localStorage.getItem("userID");
    window.location.href = `/u/${userID}`;
}

function handleNameInput(event) {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/'); 
    const pathname = pathSegments[pathSegments.length - 1];  
  
    const popupName = document.querySelector(".popup-name");
    const darkenBg = document.querySelector(".darken-background");
    let id;
    const editedName = capitalizeWords(event.target.value.split(/-/));

    if (event.key === "Enter") {
        
        darkenBg.classList.add("hidden");
        popupName.style.display = "none";
        if (pathname !== "workout.html") {
            const btnWrapper = document.querySelector(".button-wrapper");
            id = btnWrapper.id;
            msgAnim("Workout name changed!");
            
            Workout.workoutElems.forEach(workout => {
                if (workout.id === btnWrapper.id) {
                    workout.querySelector('p').textContent = editedName;
                    };
            });
            WorkoutData.dataList.forEach(data => {
                if (data.id === btnWrapper.id) {
                    data.cells.querySelector('td').textContent = editedName;
                };
            });
        } else {
            const navHeader = document.querySelector(".nav-header");
            navHeader.textContent = editedName;
            id = workoutParam;
        };
        putWorkout(id, userID, "update", editedName);
    };
}

export function handleDarkenAnim() {
    const darkenBg = document.querySelector(".darken-background");
    const popupName = document.querySelector(".popup-name");
    const privacyText = document.querySelector(".policy-text");
    const popupPW = document.querySelector("#change-pw-form");
    darkenBg.classList.toggle("hidden");
    const param = window.location.pathname;

    if (param === "/workout.html") {
        popupWrapper.classList.add("hidden");
        
    } else {
        const btnWrapper = document.querySelector(".button-wrapper");
        privacyText.classList.remove("active");
        popupPW.classList.remove("active");
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
    setTimeout(() => {
        popupMsg.textContent = "";
    }, 2500)
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