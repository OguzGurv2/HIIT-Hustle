"use strict";

import { fixContentLength, addEventListenersToContents, capitalizeWords } from "./contentManager.js";
import { fetchExercises, fetchWorkoutByID } from "./dataHandler.js";
import { handleExercises } from "./workoutHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get('workout');
const popupGrid = document.querySelector("#popup-grid");
const darkenBg = document.querySelector("#darken-background");
const nameInput = document.querySelector("#name-input");
const saveBtn = document.querySelector("#save");
const popupBtn = document.querySelector("#popup-btn");
const editBtn = document.querySelector("#edit");
const popupWrapper = document.querySelector("#popup-wrapper");
const popupName = document.querySelector("#popup-name");
const workoutName = document.querySelector(".exercise-header");
const title = document.querySelector("title");
const popupMsg = document.querySelector('#popup-msg');

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
      
      exerciseCon.appendChild(exerciseGif);
      exerciseCon.appendChild(exerciseName);
      exerciseCon.appendChild(duration);
      popupGrid.appendChild(exerciseCon);
    });
    fixContentLength();
    addEventListenersToContents(popupGrid);
    addEventListenersToContents(nameInput);
    addEventListenersToContents(popupBtn);
    addEventListenersToContents(darkenBg);
    addEventListenersToContents(editBtn);
    addEventListenersToContents(saveBtn);
  })
  .catch((error) => {
    console.error("Error fetching exercise data:", error);
  });
  
  if(workoutParam !== "newWorkout") {
    popupName.style.display = "none";
    darkenBg.classList.add('hidden');
    
    fetchWorkoutByID(workoutParam)
    .then(data => {
      const editedName = capitalizeWords(data.name.split(/-/));
  
      workoutName.textContent = editedName;
      title.textContent = editedName;
  
      data.exercise_list.forEach((exercise) => {
        handleExercises(exercise)      
      });
    });
  };
  localStorage.setItem("pageIndex", 1);
}

export { darkenBg, popupWrapper, popupName, workoutName, saveBtn, title, popupMsg, workoutParam };
