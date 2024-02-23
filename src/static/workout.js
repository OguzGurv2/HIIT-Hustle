"use strict";

import { fetchExercises } from "./fetchData.js";
import { fixContentLength, addEventListenersToContents } from "./contentManager.js";

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
let workoutCon = document.querySelector('#workout-content');
const popupMsg = document.querySelector('#popup-msg');

let exerciseAdded = false;

document.addEventListener("DOMContentLoaded", () => {

  fetchExercises()
    .then((exercises) => {
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

        let words = exercise.name.split(/-/);

        let editedName = words
          .map((word) => {
            if (word.length > 0) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            } else {
              return word;
            }
          })
          .join(" ");

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

  localStorage.setItem("pageIndex", 1);
});

export { darkenBg, popupWrapper, popupName, workoutName, saveBtn, title, workoutCon, popupMsg, exerciseAdded };
