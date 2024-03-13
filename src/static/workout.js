"use strict";

import { fixContentLength, addEventListenersToContents, capitalizeWords } from "./contentManager.js";
import { fetchExerciseByID, fetchExercises, fetchWorkoutByID } from "./dataHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get('workout');
const popupGrid = document.querySelector("#popup-grid");
const darkenBg = document.querySelector("#darken-background");
const nameInput = document.querySelector("#name-input");
const saveBtn = document.querySelector("#save");
const addExercise = document.querySelector("#add-exercise");
const editBtn = document.querySelector("#edit");
const popupWrapper = document.querySelector("#popup-wrapper");
const popupName = document.querySelector("#popup-name");
const workoutName = document.querySelector(".nav-header");
const title = document.querySelector("title");
const popupMsg = document.querySelector('#popup-msg');
let workoutCon = document.querySelector("#workout-content");
const startBtn = document.querySelector("#start");

let isSaved = false;
let isUpdated = false;

if (workoutParam) {
  
  fetchExercises()
  .then(exercises => {
    exercises.forEach((exercise) => {
      
      const exerciseCon = document.createElement("a");
      exerciseCon.classList.add("grid-container");
      exerciseCon.classList.add("child");
      exerciseCon.id = exercise.name;
      
      const exerciseGif = document.createElement("img");
      exerciseGif.classList.add("exercise-gif");
      exerciseGif.src = exercise.url;
      
      const exerciseName = document.createElement("p");
      exerciseName.classList.add("exercise-p");
      const editedName = capitalizeWords(exercise.name.split(/-/));
      exerciseName.textContent = editedName;
      
      const duration = document.createElement("p");
      duration.classList.add("exercise-p");
      duration.id = "duration";
      duration.textContent = exercise.duration + "s";
      
      const deleteExercise = document.createElement("div");
      deleteExercise.classList.add("delete-exercise");
      deleteExercise.classList.add("hidden");
      deleteExercise.textContent = "X";
  
      exerciseCon.appendChild(deleteExercise);
      exerciseCon.appendChild(exerciseGif);
      exerciseCon.appendChild(exerciseName);
      exerciseCon.appendChild(duration);
      popupGrid.appendChild(exerciseCon);
    });
    const childList = document.querySelectorAll(".child");
    fixContentLength(childList);
    addEventListenersToContents(popupGrid);
    addEventListenersToContents(nameInput);
    addEventListenersToContents(addExercise);
    addEventListenersToContents(darkenBg);
    addEventListenersToContents(editBtn);
    addEventListenersToContents(saveBtn);
    addEventListenersToContents(startBtn);
  })
  .catch((error) => {
    console.error("Error fetching exercise data:", error);
  });
  
  if(workoutParam !== "newWorkout") {
    isSaved = true;
    popupName.style.display = "none";
    darkenBg.classList.add("hidden");

    fetchWorkoutByID(workoutParam)
    .then(data => {
      const editedName = capitalizeWords(data.name.split(/-/));

      workoutName.textContent = editedName;
      title.textContent = editedName;
  
      data.exercise_list.forEach((exercise) => {
        fetchExerciseByID(exercise)
        .then(data => {
          const exerciseCon = document.createElement("a");
          exerciseCon.classList.add("grid-container");
          exerciseCon.classList.add("child");
          exerciseCon.id = data.name;
          
          const exerciseGif = document.createElement("img");
          exerciseGif.classList.add("exercise-gif");
          exerciseGif.src = data.url;
          
          const exerciseName = document.createElement("p");
          exerciseName.classList.add("exercise-p");
          const editedName = capitalizeWords(data.name.split(/-/));
          exerciseName.textContent = editedName;
          
          const duration = document.createElement("p");
          duration.classList.add("exercise-p");
          duration.id = "duration";
          duration.textContent = data.duration + "s";
          
          const deleteExercise = document.createElement("div");
          deleteExercise.classList.add("delete-exercise");
          deleteExercise.classList.add("hidden");
          deleteExercise.textContent = "X";
      
          exerciseCon.appendChild(deleteExercise);
          exerciseCon.appendChild(exerciseGif);
          exerciseCon.appendChild(exerciseName);
          exerciseCon.appendChild(duration);
          workoutCon.appendChild(exerciseCon);
        })
        const childList = document.querySelectorAll(".child");
        fixContentLength(childList);
        addEventListenersToContents(workoutCon);
        handleStartBtn();
      });
    });

  };
  localStorage.setItem("pageIndex", 1);
}

export function handleSaveParam() {
  isSaved = true;
}

export function handleUpdateParam(bool) {
  isUpdated = bool;
}

export function handleExercises(param) {
    workoutCon = document.querySelector('#workout-content');
    const clonedExercise = param.currentTarget.cloneNode(true)
        
    popupMsg.textContent = "Exercise Added!";
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);

    workoutCon.appendChild(clonedExercise);
    handleUpdateParam(true);
    const childList = document.querySelectorAll("child");
    fixContentLength(childList);
    handleSave();
    handleStartBtn();
    addEventListenersToContents(clonedExercise);
}

function handleSave() {
    workoutCon = document.querySelector('#workout-content');
    if (workoutCon.childNodes.length > 0 && isUpdated) {
        document.querySelector("#save").classList.remove('hidden');
        handleUpdateParam(false);
    } else {
        document.querySelector("#save").classList.add('hidden');
    }
    handleStartBtn();
}

export function handleDelete(event) {
    workoutCon = document.querySelector('#workout-content');
    event.target.parentNode.remove();

    popupMsg.textContent = "Exercise Deleted!";
    popupMsg.classList.remove('animate-down');
    popupMsg.classList.add('animate-up');
    handleUpdateParam(true);
    setTimeout(() => {
        popupMsg.classList.remove('animate-up');
        popupMsg.classList.add('animate-down');
    }, 1500);
    handleSave();
    handleStartBtn();
}

export function handleStartBtn() {
    if (isSaved && !isUpdated) {
        return startBtn.classList.remove("hidden");
    }
    startBtn.classList.add("hidden");
}

export { darkenBg, popupWrapper, popupName, workoutName, saveBtn, title, popupMsg, workoutParam, isSaved, isUpdated, startBtn };
