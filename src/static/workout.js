"use strict";

import { fixContentLength, addEventListenersToContents, capitalizeWords, msgAnim, getNodeListIds } from "./contentManager.js";
import { fetchExerciseByID, fetchExercises, fetchWorkoutByID, sendWorkout } from "./dataHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get('workout');
const popupGrid = document.querySelector("#popup-grid");
const darkenBg = document.querySelector(".darken-background");
const nameInput = document.querySelector("#name-input");
const saveBtn = document.querySelector("#save");
const exerciseElem = document.querySelector("#add-exercise");
const editBtn = document.querySelector("#edit");
const popupWrapper = document.querySelector("#popup-wrapper");
const popupName = document.querySelector(".popup-name");
const workoutName = document.querySelector(".nav-header");
const title = document.querySelector("title");
let workoutCon = document.querySelector("#workout-content");
const startBtn = document.querySelector("#start");

let isSaved = false;
let isUpdated = false;

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("pageIndex", 1);
});

if (workoutParam) {
  popupName.style.display = "flex";
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
      duration.classList.add("duration");
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
    addEventListenersToContents(exerciseElem);
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
          const exerciseCon = document.createElement("div");
          exerciseCon.classList.add("row-child");
          exerciseCon.id = data.name;
          
          const exerciseGif = document.createElement("img");
          exerciseGif.src = data.url;
          
          const textWrapper = document.createElement("div");
          textWrapper.classList.add("text-wrapper");

          const exerciseName = document.createElement("p");
          const editedName = capitalizeWords(data.name.split(/-/));
          exerciseName.textContent = editedName;
          
          const duration = document.createElement("p");
          duration.classList.add("duration");
          duration.textContent = data.duration + "s";
          
          const deleteExercise = document.createElement("div");
          deleteExercise.classList.add("delete-exercise");
          deleteExercise.classList.add("hidden");
          const icon = document.createElement("i");
          icon.classList.add("fa-solid");
          icon.classList.add("fa-trash");
          deleteExercise.appendChild(icon);
      
          exerciseCon.appendChild(exerciseGif);
          exerciseCon.appendChild(textWrapper);
          textWrapper.appendChild(exerciseName);
          textWrapper.appendChild(duration);
          exerciseCon.appendChild(textWrapper);
          exerciseCon.appendChild(deleteExercise);
          workoutCon.appendChild(exerciseCon);
        })
        const childList = document.querySelectorAll(".child");
        fixContentLength(childList);
        addEventListenersToContents(workoutCon);
        handleStartBtn();
      });
    });

  };
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

    msgAnim("Exercise added!");
    workoutCon.appendChild(clonedExercise);
    handleUpdateParam(true);
    const childList = document.querySelectorAll("child");
    fixContentLength(childList);
    handleSave();
    handleStartBtn();
    addEventListenersToContents(clonedExercise);
}

export function addExercise() {
  const darkenBg = document.querySelector(".darken-background");

  darkenBg.classList.remove("hidden");
  popupWrapper.classList.remove("hidden");

  if (isUpdated || isSaved) {
    document.querySelectorAll(".delete-exercise").forEach((elem) => {
      elem.classList.add("hidden");
    });
  };
}

export function handleEditBtn() {
  if (isUpdated || isSaved) {
      document.querySelectorAll(".delete-exercise").forEach((elem) => {
          elem.classList.toggle("hidden");
      });
  }
}

export function handleSaveBtn(event) {
  const id = workoutParam;
  const workoutName = document.querySelector('.nav-header').textContent;
  const nodeList = document.querySelector('#workout-content').childNodes;
  const exerciseList = getNodeListIds(nodeList);
  event.target.classList.add('hidden');

  if (!isSaved) {
      handleSaveParam();
      return sendWorkout(workoutName, exerciseList);
  }; 
  putWorkout(id, "update", workoutName, exerciseList);
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

export function deleteExercise(event) {
    workoutCon = document.querySelector('#workout-content');
    event.target.parentNode.parentNode.remove();

    msgAnim("Exercise deleted!");
    handleUpdateParam(true);
    handleSave();
    handleStartBtn();
}

export function handleStartBtn() {
    if (isSaved && !isUpdated) {
        return startBtn.classList.remove("hidden");
    }
    startBtn.classList.add("hidden");
}

export function startWorkout() {
  window.location.href = `startWorkout.html?workout=${workoutParam}`;
}

export { darkenBg, popupWrapper, popupName, workoutName, saveBtn, title, workoutParam, isSaved, isUpdated, startBtn };
