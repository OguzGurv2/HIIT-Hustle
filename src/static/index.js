"use strict";

import { addEventListenersToContents, findWorkoutByID, fixContentLength, capitalizeWords, msgAnim } from "./contentManager.js";
import { fetchExercises, fetchWorkouts, editData, putWorkout, sendWorkout, fetchPrivacyPolicy } from "./dataHandler.js";

const darkenBg = document.querySelector(".darken-background");
const editName = document.querySelector("#edit-name");
const nameInput = document.querySelector("#name-input");
const btnWrapper = document.querySelector(".button-wrapper");
const createWorkout = document.querySelector('#create-workout');
const root = document.documentElement;

//#region Initiliaze Webpage

if(window.location.pathname === "/") {
  const user = 0;
  debugger;
  if (!user) {
    window.location.href = "userAccess.html";
  }

  const deleteWorkoutBtn = document.querySelector("#delete-workout");
  
  if (localStorage.getItem("themeColor")) {
    root.style.setProperty('--secondary', localStorage.getItem("themeColor"));
  }

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
  privacyPolicyText();
};

//#endregion

//#region Exercise

class Exercise {
  constructor(data) {
    this.data = data;
  }

  render() {
    editData(this.data, "exercise");
  }
}

//#endregion

//#region Workout

class Workout {
  static workoutElems = [];

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
    Workout.workoutElems.push(this.node);
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

//#endregion

//#region WorkoutData

class WorkoutData {
  static dataList = [];

  constructor(data) {
    this.data = data;
    this.cells = null;
    this.id = data.id;
  }

  render() {
    this.cells = editData(this.data, "workout-data");
    let numericData = parseFloat(this.cells.lastChild.textContent);
    WorkoutData.dataList.push({
      id: this.id,
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

//#endregion

//#region Setting

class Setting {

  constructor(node) {
    this.node = node;
    this.dropdownBtn = this.node.querySelector(".settings-dropdown-btn");
    this.dropdownCon = this.node.querySelector(".settings-dropdown");
    
    if (this.node.id === "profile") {
      this.changePasswordBtn = this.node.querySelector(".change-password");
      this.changePasswordEvent();
    
    } else if (this.node.id === "app-settings") {
      this.colors = this.node.querySelectorAll(".color-swatch");

      if (localStorage.getItem("themeColor")) {
        for (let i = 0; i < this.colors.length; i++) {
          if (localStorage.getItem("themeColor") === this.colors[i].getAttribute('data-color')) {            
            this.colors[i].classList.add("selected");
            this.selectedColor = this.colors[i];
          }          
        }
      } else {
        this.colors[0].classList.add("selected");
        this.selectedColor = this.colors[0];
      }
      this.colorSwitchEvent();

    } else if (this.node.id === "policy") {
      this.privacyText = document.querySelector(".policy-text")
      return this.popupEvent();
    }
    this.dropdownEvent();
  }

  dropdownEvent() {
    this.dropdownBtn.addEventListener("click", () => {
      this.dropdownCon.classList.toggle("active");
    });
  }

  changePasswordEvent() {
    this.changePasswordBtn.addEventListener("click", () => {
      console.log("password change event");
    });
  }

  colorSwitchEvent() {
    this.colors.forEach((color) => {
      color.addEventListener("click", () => {
        if (this.selectedColor != color) {
          color.classList.add("selected");
          this.selectedColor.classList.remove("selected");
          this.selectedColor = color;
          root.style.setProperty('--secondary', color.getAttribute('data-color'));
          if (localStorage.getItem("themeColor")) {
            localStorage.removeItem("themeColor");
          }
          localStorage.setItem("themeColor", color.getAttribute('data-color'));
        };
      });
    });
  }

  popupEvent() {
    this.dropdownBtn.addEventListener("click", () => {
      darkenBg.classList.remove("hidden");
      this.privacyText.classList.toggle("active");
    });
  }

}

const settingsList = document.querySelectorAll("li");
settingsList.forEach((setting) => {
  if (setting.id) {
    new Setting(setting);
  }
});

//#endregion

//#region Additional Functions

export function handleNameChange(event) {
  const popupName = document.querySelector(".popup-name");
  const btnWrapper = document.querySelector(".button-wrapper");
  btnWrapper.style.display = "none";
  popupName.style.display = "flex";
  nameInput.placeholder =  findWorkoutByID(event).querySelector('p').textContent;
}

export function handleNameInput(event) {
  const popupName = document.querySelector(".popup-name");
  const btnWrapper = document.querySelector(".button-wrapper");
  
  if (event.key === "Enter") {
      
      darkenBg.classList.add("hidden");
      popupName.style.display = "none";
      
      const editedName = capitalizeWords(event.target.value.split(/-/));

      putWorkout(btnWrapper.id, "update", editedName);
      msgAnim("Workout name changed!");
          
      Workout.workoutElems.forEach(workout => {
          if (workout.id === btnWrapper.id) {
            workout.querySelector('p').textContent = editedName;
          };
      });
      WorkoutData.dataList.forEach(data => {
        if (data.id === btnWrapper.id) {
          data.cells.querySelector('td').textContent = editedName;
        };
    });
  };
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

function privacyPolicyText() {
  const policyCon = document.querySelector(".policy-text");
  fetchPrivacyPolicy()
  .then((data) => {
    const text = data.description;
    const sentences = text.split('. ');
    let currentParagraph = document.createElement('p');

    sentences.forEach((sentence, index) => {
      if (/^\d/.test(sentence.trim())) {
        policyCon.appendChild(currentParagraph);
        policyCon.appendChild(document.createElement('br'));

        const h3 = document.createElement('h3');
        const edittedSentence = sentence.replace(/(\d+)(\s)/, '$1.$2');
        h3.textContent = edittedSentence + ":";
        policyCon.appendChild(h3);
        policyCon.appendChild(document.createElement('br'));

        return currentParagraph = document.createElement('p');
      } else if (sentence.includes(":")) {
        policyCon.appendChild(currentParagraph);
        currentParagraph = document.createElement('p');

        return currentParagraph.textContent = sentence;
      } else if (index === sentences.length - 1) {
        currentParagraph.textContent += sentence + ". ";
        currentParagraph.style.paddingBottom = "20px";
        return policyCon.appendChild(currentParagraph);        
      }
      currentParagraph.textContent += sentence + ". ";
    });
  });
}

//#endregion

export {root};
