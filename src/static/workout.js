"use strict";

import {
  fixContentLength,
  addEventListenersToContents,
  capitalizeWords,
  msgAnim,
  Exercise,
  createInstructions,
} from "./contentManager.js";
import {
  fetchExerciseByID,
  fetchExercises,
  fetchWorkoutByID,
  putWorkout,
} from "./dataHandler.js";

import { root } from "./home.js";

// global variables, parameters for initializing web page
const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get("workout");
const darkenBg = document.querySelector(".darken-background");
const popupWrapper = document.querySelector("#popup-wrapper");
const popupName = document.querySelector(".popup-name");
const workoutName = document.querySelector(".nav-header");
const title = document.querySelector("title");
const startBtn = document.querySelector("#start");
const editBtn = document.querySelector("#edit");
const addExerciseBtn = document.querySelector("#add-exercise");
const pauseBtn = document.querySelector("#pause");
const navBtn = document.querySelector(".nav-btn");
const userID = localStorage.getItem("userID");
const closeBtns = document.querySelectorAll(".close");

let timesFinished = 0;
let editMode = false;

//#region Initialize Webpage

if (workoutParam) {
  timesFinished = 0;
  const nameInput = document.querySelector("#name-input");
  popupName.style.display = "none";
  darkenBg.classList.add("hidden");

  // sets local storage items
  localStorage.setItem("pageIndex", 1);

  if (localStorage.getItem("themeColor")) {
    root.style.setProperty("--secondary", localStorage.getItem("themeColor"));
  }

  // fetchs exercises and renders with Exercise Class
  fetchExercises()
    .then((exercises) => {
      exercises.forEach((exercise) => {
        const gridExerciseElem = new Exercise(exercise);
        gridExerciseElem.renderHomeAndWorkoutPage();
      });
      const childList = document.querySelectorAll(".child");
      fixContentLength(childList);
    })
    .catch((error) => {
      console.error("Error fetching exercise data:", error);
    });

  // fetchs workout by id, renders the workout name,
  fetchWorkoutByID(workoutParam)
    .then((data) => {
      const editedName = capitalizeWords(data.name.split(/-/));
      workoutName.textContent = editedName;
      title.textContent = editedName;
      timesFinished = data.times_finished;

      // If exercise list existsit will fetch each exercise by id
      // and render the items with Workout Exercise Class
      if (data.exercise_list != null) {
        for (let i = 0; i < data.exercise_list.length; i++) {
          fetchExerciseByID(data.exercise_list[i]).then((exerciseData) => {
            const dataObj = exerciseData;
            dataObj.restTime = data.rest_time_list[i];
            const workoutExerciseElem = new WorkoutExercise(exerciseData);
            workoutExerciseElem.render();
          });
        }
      } else {
        popupName.style.display = "flex";
        darkenBg.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("Error fetching workout data:", error);
    });
  addEventListenersToContents(navBtn);
  addEventListenersToContents(nameInput);
  addEventListenersToContents(addExerciseBtn);
  addEventListenersToContents(darkenBg);
  addEventListenersToContents(editBtn);
  addEventListenersToContents(startBtn);
  addEventListenersToContents(pauseBtn);
  closeBtns.forEach((button) => {
    addEventListenersToContents(button);
  })
}

//#endregion

//#region Workout Exercise

export class WorkoutExercise {
  static elems = [];
  static finishedExercises = [];
  static dropdownIcons = ["fa-angle-down", "fa-angle-left"];
  static exerciseIndex = 0;

  constructor(data) {
    this.isOpen = false;
    this.data = data;
    this.node = null;
    this.buttonMode = null;
    this.mainContent = null;
    this.extendableContent = null;
    this.iconCon = null;
    this.icon = null;
    this.increaseRest = null;
    this.lowerRest = null;
    this.originalRestTime = null;
    this.restTime = null;
    this.deleteBtn = null;
    this.dropdownBtn = null;
    this.durationNode = null;
    this.originalDuration = null;
    this.duration = null;
    this.isFinished = false;
    this.counter = 0;
  }

  // renders workout exercise
  render() {
    const template = document.querySelector(".workout-exercise-template");
    const content = template.content.cloneNode(true);
    this.node = document.importNode(content, true).firstElementChild;
    const workoutCon = document.querySelector("#workout-content");
    workoutCon.appendChild(this.node);
    this.node.id = this.data.name;
    this.node.querySelector("img").src = this.data.url;
    const editedName = capitalizeWords(this.data.name.split(/-/));
    this.node.querySelector("p").textContent = editedName;
    this.node.querySelector("span").textContent = this.data.duration + "s";
    const instructions = this.node.querySelector(".instructions-div");
    createInstructions(this.data, instructions);

    const restDuration = this.node.querySelector(".restDuration");
    if (this.data.restTime != null) {
      restDuration.textContent = this.data.restTime + "s";
    } else {
      restDuration.textContent = "5s";
    }

    this.handleContent();
  }

  // handles content by matching instance properties to html elems
  handleContent() {
    this.iconCon = this.node.querySelector(".icon-container");
    this.icon = this.iconCon.querySelector("i");
    this.mainContent = this.node.querySelector(".main-content");
    this.extendableContent = this.node.querySelector("#extendable-content");
    this.restTime = this.extendableContent.querySelector(".restDuration");
    this.increaseRest = this.extendableContent.querySelector(".fa-plus");
    this.lowerRest = this.extendableContent.querySelector(".fa-minus");
    this.durationNode = this.node.querySelector("span");
    this.duration = this.durationNode.textContent;
    this.originalDuration = parseInt(this.duration, 10);
    this.originalRestTime = parseInt(this.restTime.textContent, 10);
    WorkoutExercise.elems.push(this);
    this.isOpen = true;
    this.handleContentSize();
    this.handleButton();
    this.handleRestTime();
    handleStartBtn();
  }

  // handles button events
  handleButton() {
    this.iconCon.addEventListener("click", () => {
      this.buttonMode = this.detectButton();
      if (WorkoutExercise.dropdownIcons.includes(this.buttonMode)) {
        this.handleContentSize();
      } else {
        this.deleteExercise();
      }
    });
  }

  // detects buttons
  detectButton() {
    return this.iconCon.querySelector("i").classList[1];
  }

  // handles content size
  handleContentSize() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.extendContent();
    } else {
      this.isOpen = false;
      this.shortenContent();
    }
  }

  // extends the content
  extendContent() {
    this.extendableContent.style.display = "block";
    this.icon.classList.remove("fa-angle-left");
    this.icon.classList.add("fa-angle-down");
    this.mainContent.style.height = "22.5vh";
    this.mainContent.firstElementChild.style.display = "block";
    this.mainContent.firstElementChild.firstElementChild.style.height = "70%";
  }

  // shortens the content
  shortenContent() {
    this.extendableContent.style.display = "none";
    this.icon.classList.remove("fa-angle-down");
    this.icon.classList.add("fa-angle-left");
    this.mainContent.style.height = "10vh";
    this.mainContent.firstElementChild.style.display = "flex";
    this.mainContent.firstElementChild.firstElementChild.style.height = "10vh";
  }

  // deletes the exercise from the workout
  deleteExercise() {
    this.node.remove();
    WorkoutExercise.removeFromElems(this.node);
    msgAnim("Exercise deleted!");
    saveExercises();
  }

  // gets icons class inside the instance
  getIconClass() {
    return this.icon.classList[1];
  }

  // countdown function for workout exercise
  // to visualy show the countdown
  countdown() {
    let currentDuration = parseInt(this.durationNode.textContent, 10);
    if (currentDuration > 0) {
      currentDuration -= 1;
      this.durationNode.textContent = currentDuration + "s";
    } else {
      let currentRestDuration = parseInt(this.restTime.textContent, 10);

      if (currentRestDuration > 0) {
        currentRestDuration -= 1;
        this.restTime.textContent = currentRestDuration + "s";
      } else {
        this.node.style.display = "none";
        this.durationNode.textContent = this.duration;
        this.isFinished = true;
        WorkoutExercise.finishedExercises.push(this);
        WorkoutExercise.exerciseIndex++;
        timer.findExercise(WorkoutExercise.exerciseIndex);
      }
    }
  }

  // handles the rest time of the instance
  handleRestTime() {
    let currentRestTime = parseInt(this.restTime.textContent, 10);
    this.lowerRest.addEventListener("click", () => {
      if (currentRestTime > 0) {
        currentRestTime -= 1;
        this.originalRestTime = currentRestTime;
        this.restTime.textContent = currentRestTime + "s";
        saveExercises();
      }
    });
    this.increaseRest.addEventListener("click", () => {
      if (currentRestTime < 10) {
        currentRestTime += 1;
        this.originalRestTime = currentRestTime;
        this.restTime.textContent = currentRestTime + "s";
        saveExercises();
      }
    });
  }

  // starts workout for the instance
  static startWorkout() {
    for (let i = 0; i < this.elems.length; i++) {
      this.elems[i].increaseRest.style.display = "none";
      this.elems[i].lowerRest.style.display = "none";
      this.elems[i].restTime.style.width = "100%";
    }
  }

  // stops workout for the instance
  static stopWorkout() {
    for (let i = 0; i < this.elems.length; i++) {
      this.elems[i].node.style.display = "block";
      this.elems[i].durationNode.textContent =
        this.elems[i].originalDuration + "s";
      this.elems[i].restTime.textContent = this.elems[i].originalRestTime + "s";
      this.elems[i].increaseRest.style.display =
        "var(--fa-display, inline-block)";
      this.elems[i].lowerRest.style.display = "var(--fa-display, inline-block)";
      this.elems[i].restTime.style.width = "60%";
      this.elems[i].isSelected = true;
      WorkoutExercise.removeFromFinished(this.finishedExercises[i]);
      if (this.elems[0] !== this.elems[i]) {
        this.elems[i].isOpen = true;
        this.elems[i].handleContentSize();
      }
    }
  }

  // handles delete buttons
  static handleDeleteBtns() {
    const elemList = WorkoutExercise.elems;
    if (elemList.length > 0) {
      if (editMode) {
        elemList.forEach((child) => {
          child.icon.classList.remove(child.getIconClass());
          child.icon.classList.add("fa-trash");
        });
      } else {
        elemList.forEach((child) => {
          child.icon.classList.remove("fa-trash");
          child.isOpen = !child.isOpen;
          child.handleContentSize();
        });
      }
    }
  }

  // removes exercise from WorkoutExercise.elems
  // to not confuse the system
  static removeFromElems(elem) {
    let index = WorkoutExercise.elems.indexOf(elem);
    WorkoutExercise.elems.splice(index, 1);
  }

  // removes exercise from the finishedExercises
  // to restart the workout session
  static removeFromFinished(elem) {
    let index = WorkoutExercise.finishedExercises.indexOf(elem);
    WorkoutExercise.finishedExercises.splice(index, 1);
  }
}

//#endregion

//#region Timer

class Timer {
  constructor() {
    this.node = document.querySelector("#timer");
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.isActive = false;
    this.selectedNode = null;
    this.isPaused = false;
  }

  // handles workout session
  handleWorkoutSession() {
    if (!this.isActive) {
      this.startSession();
    } else {
      this.stopSession();
    }
  }

  // starts the workout session
  startSession() {
    this.node.classList.remove("hidden");
    this.isActive = true;
    this.findExercise(0);
    this.startWatch();
    this.handleBtns();
  }

  // stops the workout session
  stopSession() {
    this.node.classList.add("hidden");
    this.isActive = false;
    this.stopWatch();
    this.handleBtns();
  }

  // pauses the workout session
  handlePause() {
    if (this.isPaused) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    } else {
      this.startWatch();
    }
  }

  // starts the stop watch
  startWatch() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.startTime = Date.now() - this.elapsedTime;
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.node.textContent = this.timeToString(this.elapsedTime);
      this.selectedNode.countdown();
    }, 1000);
  }

  // stops the stop watch
  stopWatch() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.elapsedTime = 0;
    this.node.textContent = "00:00";
  }

  // handles the footer buttons
  handleBtns() {
    if (this.isActive) {
      editBtn.style.display = "none";
      addExerciseBtn.style.display = "none";
      pauseBtn.style.display = "var(--fa-display, inline-block)";
    } else {
      editBtn.style.display = "var(--fa-display, inline-block)";
      addExerciseBtn.style.display = "var(--fa-display, inline-block)";
      pauseBtn.style.display = "none";
    }
  }

  // adjusts time for interval
  timeToString(time) {
    let diffInMin = time / 60000;
    let min = Math.floor(diffInMin);

    let diffInSec = (diffInMin - min) * 60;
    let sec = Math.floor(diffInSec);

    let formattedMin = min.toString().padStart(2, "0");
    let formattedSec = sec.toString().padStart(2, "0");

    return `${formattedMin}:${formattedSec}`;
  }

  // finds the last exercise to adjust the countdown
  findExercise(index) {
    if (WorkoutExercise.elems[index]) {
      this.selectedNode = WorkoutExercise.elems[index];
      this.selectedNode.isOpen = false;
      this.selectedNode.isSelected = true;
      return this.selectedNode.handleContentSize();
    }
    startBtn.textContent = "Start";
    saveExercises("count");
    WorkoutExercise.stopWorkout();
    timer.handleWorkoutSession();
  }
}

const timer = new Timer();

//#endregion

//#region Additional Functions

// general function for saving exercise list of workout
export function saveExercises(param) {
  const workoutText = workoutName.textContent;
  const id = workoutParam;
  const exerciseList = [];
  const restTimeList = [];

  if (param === "count") {
    timesFinished++;
    return putWorkout(
      id,
      userID,
      "count",
      workoutText,
      exerciseList,
      restTimeList,
      timesFinished
    );
  }

  for (let i = 0; i < WorkoutExercise.elems.length; i++) {
    const exercise = WorkoutExercise.elems[i].node.id;
    const restTime = WorkoutExercise.elems[i].originalRestTime;
    exerciseList.push(exercise);
    restTimeList.push(restTime);
  }

  msgAnim("Workout Finished!");
  handleStartBtn();
  putWorkout(
    id,
    userID,
    "update",
    workoutText,
    exerciseList,
    restTimeList,
    ++timesFinished
  );
}

// handles adding exercise button animations
export function handleAddExerciseBtn() {
  darkenBg.classList.remove("hidden");
  popupWrapper.classList.remove("hidden");
  editMode = false;
  WorkoutExercise.handleDeleteBtns();
}

// handles animation for editing button
export function handleEditBtn() {
  if (!editMode) {
    editMode = true;
    WorkoutExercise.handleDeleteBtns();
  } else {
    editMode = false;
    WorkoutExercise.handleDeleteBtns();
  }
}

// handles content for workout session start button
export function handleStartBtn() {
  if (WorkoutExercise.elems.length > 0) {
    return startBtn.classList.remove("hidden");
  }
  startBtn.classList.add("hidden");
}

// starts the workout session by conneting timer class
// to workout exercise class
export function startWorkoutSession(event) {
  if (!timer.isActive) {
    event.target.textContent = "Finish";
    WorkoutExercise.startWorkout();
  } else {
    event.target.textContent = "Start";
    WorkoutExercise.stopWorkout();
  }
  timer.handleWorkoutSession();
}

// pauses the workout session by conneting timer class
// to workout exercise class
export function pauseWorkoutSession(event) {
  if (!timer.isPaused) {
    event.target.classList.remove("fa-pause");
    event.target.classList.add("fa-play");
    timer.isPaused = true;
  } else {
    event.target.classList.remove("fa-play");
    event.target.classList.add("fa-pause");
    timer.isPaused = false;
  }
  timer.handlePause();
}

//#endregion

export { popupWrapper, workoutName, title, workoutParam, userID };
