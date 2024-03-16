"use strict";

import { addEventListenersToContents, findWorkoutByID, fixContentLength } from "./contentManager.js";
import { fetchExercises, fetchWorkouts, editData, putWorkout } from "./dataHandler.js";

const darkenBg = document.querySelector(".darken-background");
const editName = document.querySelector("#edit-name");
const nameInput = document.querySelector("#name-input");
const workoutList = document.querySelector('.row-grid').childNodes;
const btnWrapper = document.querySelector(".button-wrapper");

if(window.location.pathname === "/") {
  const deleteWorkoutBtn = document.querySelector("#delete-workout");
  
  fetchExercises()
  .then((exercises) => {
      exercises.forEach((exercise) => {
        editData(exercise, "exercise");
      });
      const childList = document.querySelectorAll(".child");
      fixContentLength(childList);
    })
    .catch((error) => {
      console.error("Error fetching exercise data:", error);
    });
  
  fetchWorkouts()
  .then((workouts) => {
      if (workouts.length === 10) {
        const createWorkout = document.querySelector('#create-workout');
        createWorkout.classList.add('hidden');
      }
      workouts.forEach((workout) => {
        editData(workout, "workout");
      });
    })
    .catch((error) => {
      console.error("Error fetching workout data:", error);
    });
    
  addEventListenersToContents(darkenBg);
  addEventListenersToContents(editName);
  addEventListenersToContents(nameInput);
  addEventListenersToContents(deleteWorkoutBtn);
};

export function handleOptions(event) {
  darkenBg.classList.toggle("hidden");
  btnWrapper.style.display = "grid";
  btnWrapper.id = event.target.parentNode.id;
}

export function handleOptionsBtn(event) {
  if (!event.target.classList.contains("options") && !event.target.parentNode.classList.contains("options")) {
      window.location.href = `workout.html?workout=${event.target.parentNode.id}`;
  }
}

export function handleNameChange(event) {
  const popupName = document.querySelector(".popup-name");
  const btnWrapper = document.querySelector(".button-wrapper");
  btnWrapper.style.display = "none";
  popupName.style.display = "flex";
  nameInput.placeholder =  findWorkoutByID(event).querySelector('p').textContent;
}

export function deleteWorkout(event) {
  putWorkout(btnWrapper.id, "delete");
  findWorkoutByID(event).remove();
}

export { workoutList };
