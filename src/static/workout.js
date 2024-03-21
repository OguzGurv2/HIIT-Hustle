"use strict";

import { fixContentLength, addEventListenersToContents, capitalizeWords, msgAnim } from "./contentManager.js";
import { fetchExerciseByID, fetchExercises, fetchWorkoutByID, editData, putWorkout } from "./dataHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const workoutParam = urlParams.get('workout');
const darkenBg = document.querySelector(".darken-background");
const popupWrapper = document.querySelector("#popup-wrapper");
const popupName = document.querySelector(".popup-name");
const workoutName = document.querySelector(".nav-header");
const title = document.querySelector("title");
let workoutCon = document.querySelector("#workout-content");
const startBtn = document.querySelector("#start");

let editMode = true;

if (workoutParam) {
  const nameInput = document.querySelector("#name-input");
  const editBtn = document.querySelector("#edit");
  const exerciseElem = document.querySelector("#add-exercise");
  popupName.style.display = "none";
  darkenBg.classList.add("hidden");

  localStorage.setItem("pageIndex", 1);

  fetchExercises()
  .then(exercises => {
    exercises.forEach((exercise) => {
      const gridExerciseElem = new GridExercise(exercise);
      gridExerciseElem.render();
    });
    const childList = document.querySelectorAll(".child");
    fixContentLength(childList);
  })
  .catch((error) => {
    console.error("Error fetching exercise data:", error);
  });
  
  fetchWorkoutByID(workoutParam)
  .then(data => {
    const editedName = capitalizeWords(data.name.split(/-/));
    workoutName.textContent = editedName;
    title.textContent = editedName;

    if (data.exercise_list != null) {
      data.exercise_list.forEach((exercise) => {
        fetchExerciseByID(exercise)
        .then(data => {
          const workoutExerciseElem = new WorkoutExercise(data);
          workoutExerciseElem.render();
        });
      });
    } else {
      popupName.style.display = "flex";  
      darkenBg.classList.remove("hidden");
    }
  })  
  .catch((error) => {
    console.error("Error fetching workout data:", error);
  });
  addEventListenersToContents(nameInput);
  addEventListenersToContents(exerciseElem);
  addEventListenersToContents(darkenBg);
  addEventListenersToContents(editBtn);
  addEventListenersToContents(startBtn);
}

class GridExercise {
  constructor(data) {
    this.data = data;
    this.node = null;
  }
  render() {
    this.node = editData(this.data, "exercise");
    this.addExerciseToWorkout();
  }
  addExerciseToWorkout() {
    this.node.addEventListener("click", () => {
      fetchExerciseByID(this.data.name)
      .then(data => {
        const workoutExerciseElem = new WorkoutExercise(data);
        workoutExerciseElem.render();
        workoutCon = document.querySelector('#workout-content');
        const workoutText = workoutName.textContent;
        const exerciseList = WorkoutExercise.getItemList(1);
        const id = workoutParam;

        addEventListenersToContents(workoutCon);
        msgAnim("Exercise added!");
        handleStartBtn();
        putWorkout(id, "update", workoutText, exerciseList);
      });
    });
  }
}

class WorkoutExercise {
  static nodes = [];
  static iconCons = [];
  static dropdownIcons = ["fa-angle-down", "fa-angle-left"];

  constructor(data) {
    this.isOpen = false;
    this.data = data;
    this.node = null;
    this.buttonMode = null;
    this.extendableContent = null;
    this.iconCon = null;
    this.icon = null;
    this.deleteBtn = null;
    this.dropdownBtn = null;
  }
  render() {
    this.node = editData(this.data, "workout-exercise");
    this.iconCon = this.node.querySelector(".icon-container");
    this.icon = this.iconCon.querySelector("i");
    this.extendableContent = this.node.querySelector("#extendable-content")
    WorkoutExercise.nodes.push(this.node);
    WorkoutExercise.iconCons.push(this.iconCon);
    this.handleButton();
    handleStartBtn();
  }
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
  detectButton() {
    return this.iconCon.querySelector("i").classList[1];
  }
  handleContentSize() {
    if (this.isOpen == false) {
      this.isOpen = true;
      this.extendContent();
    } else {
      this.isOpen = false;
      this.shortenContent();
    }
  }
  extendContent() {
    this.extendableContent.style.display = "block";
    this.icon.classList.remove("fa-angle-left");
    this.icon.classList.add("fa-angle-down");
  }
  shortenContent() {
    this.extendableContent.style.display = "none";
    this.icon.classList.remove("fa-angle-down");
    this.icon.classList.add("fa-angle-left");
  }
  deleteExercise() {
    workoutCon = document.querySelector('#workout-content');
    this.node.remove();
    WorkoutExercise.removeFromNodes(this.node);
    WorkoutExercise.removeFromNodes(this.deleteBtn);

    const workoutText = workoutName.textContent;
    const exerciseList = WorkoutExercise.getItemList(1);
    const id = workoutParam;
    
    msgAnim("Exercise deleted!");
    handleStartBtn();
    putWorkout(id, "update", workoutText, exerciseList);
  }
  static handleDeleteBtn() {
    const iconConList = WorkoutExercise.getItemList(0);
    if (iconConList.length > 0) {
      if (editMode) {
        iconConList.forEach(child => {
          // child.style.display = "flex";
        });
      } else {
        iconConList.forEach(child => {
          // child.style.display = "none";
        });
      }
    }
  }
  static removeFromNodes(node) {
    let index;
    if ( WorkoutExercise.nodes.indexOf(node)) {
      index = WorkoutExercise.nodes.indexOf(node);
      WorkoutExercise.nodes.splice(index, 1);
    } else {
      index = WorkoutExercise.iconCons.indexOf(deleteBtn);
      WorkoutExercise.iconCons.splice(index, 1);
    };
  }
  static getItemList(bool) {
    if (bool) {
      let list = [];
      WorkoutExercise.nodes.forEach(node => {
        list.push(node.id);
      });
      return list;
    } else {
      return WorkoutExercise.iconCons;
    }
  }
}

export function handleAddExerciseBtn() {
  darkenBg.classList.remove("hidden");
  popupWrapper.classList.remove("hidden");
  editMode = false;
  WorkoutExercise.handleDeleteBtn();
}

export function handleEditBtn() {
  if (!editMode) {
    editMode = true;
    WorkoutExercise.handleDeleteBtn();
  } else {
    editMode = false;
    WorkoutExercise.handleDeleteBtn();
  };
}

export function handleStartBtn() {
    if (WorkoutExercise.getItemList(1).length > 0) {
      return startBtn.classList.remove("hidden");
    }
    startBtn.classList.add("hidden");
}

export { popupWrapper, workoutName, title, workoutParam };
