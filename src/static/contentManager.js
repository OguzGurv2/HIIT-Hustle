"use strict";

import {
  popupWrapper,
  handleEditBtn,
  handleAddExerciseBtn,
  startWorkoutSession,
  pauseWorkoutSession,
  workoutParam,
  userID,
  WorkoutExercise,
  saveExercises,
} from "./workout.js";
import {
  handleNameChange,
  createNewWorkout,
  deleteWorkout,
  Workout,
  WorkoutData,
} from "./home.js";
import { putWorkout, fetchExerciseByID } from "./dataHandler.js";
import {
  exerciseHeader,
  exerciseGif,
  bodyPart,
  instructions,
} from "./exercise.js";

// adds event listeners to elements according to their ids and classes

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

// handles navigation button for workout.html and exercise.html

function handleNavBtn() {
  const userID = localStorage.getItem("userID");
  window.location.href = `/u/${userID}`;
}

// handles name input for changing workout names

function handleNameInput(event) {
  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split("/");
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

      Workout.workoutElems.forEach((workout) => {
        if (workout.id === btnWrapper.id) {
          workout.querySelector("p").textContent = editedName;
        }
      });
      WorkoutData.dataList.forEach((data) => {
        if (data.id === btnWrapper.id) {
          data.cells.querySelector("td").textContent = editedName;
        }
      });
    } else {
      const navHeader = document.querySelector(".nav-header");
      navHeader.textContent = editedName;
      id = workoutParam;
    }
    putWorkout(id, userID, "update", editedName);
  }
}

// handles dark background animation for several functions

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

// handles info messages to send to application

export function msgAnim(param) {
  const popupMsg = document.querySelector(".popup-msg");
  popupMsg.classList.add("active");
  popupMsg.textContent = param;
  popupMsg.classList.remove("animate-down");
  popupMsg.classList.add("animate-up");
  setTimeout(() => {
    popupMsg.classList.remove("animate-up");
    popupMsg.classList.add("animate-down");
  }, 1500);
  setTimeout(() => {
    popupMsg.classList.remove("active");
  }, 2500);
}

// fixes content length of exercises into a certain lenght in vh

export function fixContentLength(nodeList) {
  let maxHeight = 0;
  nodeList.forEach((child) => {
    maxHeight = Math.max(maxHeight, child.offsetHeight);
  });
  const vhMaxHeight = (maxHeight / window.innerHeight) * 100;
  nodeList.forEach((child) => {
    child.style.height = vhMaxHeight + "vh";
  });
}

// capitalizes words for data such as exercises, workouts

export function capitalizeWords(words) {
  let editedName = words
    .map((word) => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(" ");
  return editedName;
}

// finds workouts by id

export function findWorkoutByID(event) {
  const workoutList = document.querySelector(".row-grid").childNodes;
  return Array.prototype.find.call(
    workoutList,
    (workout) => workout.id === event.target.parentNode.id
  );
}

// creates instructions of exercieses from given data

export function createInstructions(data, container) {
  const paragraphs = data.description.split(/\d+\.\s/);
  for (let i = 1; i < paragraphs.length; i++) {
    const newParagraph = document.createElement("p");
    newParagraph.classList.add("exercise-p");
    newParagraph.textContent = `${i}. ${paragraphs[i]}`;
    container.appendChild(newParagraph);
  }
}

//#region Exercise Class

export class Exercise {
  constructor(data) {
    this.data = data;
    this.node = null;
  }

  // renders exercises inside home.html and workout.html
  // according to the url link parameter

  renderHomeAndWorkoutPage() {
    const template = document.querySelector(".exercise-template");
    const content = template.content.cloneNode(true);

    content.querySelector("a").id = this.data.name;
    content.querySelector("img").src = this.data.url;
    const editedName = capitalizeWords(this.data.name.split(/-/));
    content.querySelector(".exercise-p").textContent = editedName;

    const param = window.location.pathname;
    if (param !== "/workout.html") {
      content.querySelector(
        "a"
      ).href = `/exercise.html?exercise=${this.data.name}`;
      const exerciseGrid = document.querySelector("#exercise-grid");
      exerciseGrid.appendChild(content);
    } else {
      content.querySelector(".duration").textContent = this.data.duration + "s";
      this.node = content.querySelector("a");

      const popupGrid = document.querySelector("#popup-grid");
      popupGrid.appendChild(content);
      this.addExerciseToWorkout();
    }
  }

  // only renders exercises inside exercise.html

  renderExercisePage() {
    exerciseHeader.textContent =
      this.data.name.charAt(0).toUpperCase() + this.data.name.slice(1);
    exerciseGif.src = this.data.url;
    bodyPart.textContent = bodyPart.textContent + this.data.body_part;
    createInstructions(this.data, instructions);
  }

  // adds exercises into the given workout

  addExerciseToWorkout() {
    this.node.addEventListener("click", () => {
      fetchExerciseByID(this.data.name).then((data) => {
        msgAnim("Exercise added!");
        const workoutExerciseElem = new WorkoutExercise(data);
        workoutExerciseElem.render();
        saveExercises();
      });
    });
  }
}

//#endregion
