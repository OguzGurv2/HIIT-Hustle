"use strict";

import { fixContentLength, addEventListenersToContents, capitalizeWords, msgAnim, getNodeListIds, findExerciseID } from "./contentManager.js";
import { fetchExerciseByID, fetchExercises, fetchWorkoutByID, sendWorkout, editData } from "./dataHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get('workout');
const darkenBg = document.querySelector(".darken-background");
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
  const nameInput = document.querySelector("#name-input");
  const popupGrid = document.querySelector("#popup-grid");
  const saveBtn = document.querySelector("#save");
  const editBtn = document.querySelector("#edit");
  const exerciseElem = document.querySelector("#add-exercise");
  
  popupName.style.display = "flex";
  
  fetchExercises()
  .then(exercises => {
    exercises.forEach((exercise) => {
      editData(exercise, "exercise");
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
          editData(data, "workout-exercise");
        });

        const childList = document.querySelectorAll(".child");
        fixContentLength(childList);
        addEventListenersToContents(workoutCon);
        handleStartBtn();
      });
    });

  };
}

export function addExerciseToWorkout(event) {
  
  fetchExerciseByID(findExerciseID(event.target))
  .then(data => {
    editData(data, "workout-exercise");
  });
  workoutCon = document.querySelector('#workout-content');
  
  addEventListenersToContents(workoutCon);
  msgAnim("Exercise added!");
  isUpdated = true;
  handleSave();
  handleStartBtn();
}

export function handleAddExerciseBtn() {

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
  const workoutText = workoutName.textContent;
  const nodeList = document.querySelector('#workout-content').childNodes;
  const exerciseList = getNodeListIds(nodeList);
  event.target.classList.add('hidden');

  if (!isSaved) {
    isSaved = true;
    return sendWorkout(workoutText, exerciseList);
  }; 
  putWorkout(id, "update", workoutText, exerciseList);
}

function handleSave() {
    workoutCon = document.querySelector('#workout-content');
    if (workoutCon.childNodes.length > 0 && isUpdated) {
        document.querySelector("#save").classList.remove('hidden');
        isUpdated = false;
    } else {
        document.querySelector("#save").classList.add('hidden');
    }
    handleStartBtn();
}

export function deleteExercise(event) {
    workoutCon = document.querySelector('#workout-content');
    event.target.parentNode.parentNode.remove();

    msgAnim("Exercise deleted!");
    isUpdated = true;
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

export { popupWrapper, workoutName, title, workoutParam };
