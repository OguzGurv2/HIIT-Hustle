"use strict";

import { addEventListenersToContents, findWorkoutByID, fixContentLength, capitalizeWords } from "./contentManager.js";
import { fetchExercises, fetchWorkouts, editData, putWorkout, sendWorkout } from "./dataHandler.js";

const darkenBg = document.querySelector(".darken-background");
const editName = document.querySelector("#edit-name");
const nameInput = document.querySelector("#name-input");
const btnWrapper = document.querySelector(".button-wrapper");
const createWorkout = document.querySelector('#create-workout');

if(window.location.pathname === "/") {
  
  const deleteWorkoutBtn = document.querySelector("#delete-workout");
  
  fetchExercises()
  .then((exercises) => {
      exercises.forEach((exercise) => {
        const exerciseElem = new Exercise(exercise);
        exerciseElem.render();
      });
      const childList = document.querySelectorAll(".child");
      fixContentLength(childList);
    })
    .catch((error) => {
      console.error("Error fetching exercise data:", error);
    });
  
  fetchWorkouts()
  .then((workouts) => {
      if (workouts.length >= 10) {
        createWorkout.classList.add('hidden');
      }
        if (workouts.length > 1) {
          workouts.forEach((workout) => {
            const workoutElem = new Workout(workout);
            workoutElem.render();      
            
            const workoutData = new WorkoutData(workout);
            workoutData.render();
          });
        }
    })
    .catch((error) => {
      console.error("Error fetching workout data:", error);
    });
  addEventListenersToContents(createWorkout);
  addEventListenersToContents(darkenBg);
  addEventListenersToContents(editName);
  addEventListenersToContents(nameInput);
  addEventListenersToContents(deleteWorkoutBtn);
};

class Exercise {
  constructor(data) {
    this.data = data;
  }

  render() {
    editData(this.data, "exercise");
  }
}

class Workout {
  constructor(data) {
    this.data = data;
    this.node = null;
    this.icon = null;
    this.content = null;
  }

  render() {
    this.node = editData(this.data, "workout");
    this.icon = this.node.querySelector("i");
    this.content = this.node.querySelector("p");
    this.handleOption();
    this.openWorkout();
  }

  handleOption() {
    this.icon.addEventListener("click", () => {
      darkenBg.classList.toggle("hidden");
      btnWrapper.style.display = "grid";
      btnWrapper.id = this.data.id;
    });
  }

  openWorkout() {
    this.content.addEventListener("click", () => {
      window.location.href = `workout.html?workout=${this.data.id}`;
    });
  }
}

class WorkoutData {
  static dataList = [];

  constructor(data) {
    this.data = data;
    this.cells = null;
  }

  render() {
    this.cells = editData(this.data, "workout-data");
    let numericData = parseFloat(this.cells.lastChild.textContent);
    WorkoutData.dataList.push({
      cells: this.cells,
      dataCell: numericData});
    WorkoutData.sortDataList();
  }

  static sortDataList() {
    this.dataList.sort((a, b) => b.dataCell - a.dataCell);
    this.appendDataToTable();
  }

  static appendDataToTable() {
    const tBody = document.querySelector("tbody");
    this.dataList.forEach(elem => {
      tBody.appendChild(elem.cells);
    });
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
  darkenBg.classList.toggle("hidden");
  btnWrapper.style.display = "none";
}

export function createNewWorkout() {
  sendWorkout("New Workout");
}
