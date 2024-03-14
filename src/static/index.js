"use strict";

import { addEventListenersToContents, fixContentLength } from "./contentManager.js";
import { fetchExercises, fetchWorkouts, editData } from "./dataHandler.js";


const darkenBg = document.querySelector(".darken-background");
const editName = document.querySelector("#edit-name");
const nameInput = document.querySelector("#name-input");

const popupName = document.querySelector(".popup-name");
popupName.style.display = "none";

const btnWrapper = document.querySelector(".button-wrapper");
btnWrapper.style.display = "none";

addEventListenersToContents(darkenBg);
addEventListenersToContents(editName);
addEventListenersToContents(nameInput);

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
  
localStorage.removeItem("pageName");
localStorage.setItem("pageName", "index");

export function handleOptions(event) {
  darkenBg.classList.toggle("hidden");
  btnWrapper.style.display = "grid";
  btnWrapper.id = event.target.parentNode.id;
}

export { btnWrapper, popupName, nameInput, darkenBg };
