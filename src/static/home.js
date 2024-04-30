"use strict";

import { addEventListenersToContents, findWorkoutByID, fixContentLength } from "./contentManager.js";
import { fetchExercises, fetchWorkouts, editData, putWorkout, sendWorkout, fetchPrivacyPolicy, fetchUser, updateAppSettings, changePassword } from "./dataHandler.js";

const darkenBg = document.querySelector(".darken-background");
const editName = document.querySelector("#edit-name");
const nameInput = document.querySelector("#name-input");
const btnWrapper = document.querySelector(".button-wrapper");
const createWorkout = document.querySelector('#create-workout');
const root = document.documentElement;

//#region Initiliaze Webpage

  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split('/'); 
  const userID = pathSegments[pathSegments.length - 1];   

  if(userID !== "exercise.html" && userID !== "workout.html") {

    fetchUser(userID)
    .then((user) => {
      localStorage.setItem("userID", user.user_id);
      localStorage.setItem("themeColor", user.theme_color);
      
      root.style.setProperty('--secondary', user.theme_color);

      const usernames = document.querySelectorAll(".username");
      usernames.forEach((username) => {
        username.textContent = user.username + username.textContent;
      })

      const pwID = document.querySelector("#userID");
      pwID.value = user.user_id;
    });

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
      
    fetchWorkouts(userID)
    .then((workouts) => {
      if (workouts.length >= 10) {
        createWorkout.classList.add('hidden');
      };
      if (workouts.length >= 1) {
        workouts.forEach((workout) => {
          const workoutElem = new Workout(workout);
          workoutElem.render();      
          
          const workoutData = new WorkoutData(workout);
          workoutData.render();
        });
      };
    })
    .catch((error) => {
      console.error("Error fetching workout data:", error);
    });
      
    const deleteWorkoutBtn = document.querySelector("#delete-workout");
    
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

export class Workout {
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
      btnWrapper.id = this.data.workout_id;
    });
  }

  openWorkout() {
    this.content.addEventListener("click", () => {
      window.location.href = `/workout.html?workout=${this.data.workout_id}`;
    });
  }
}

//#endregion

//#region WorkoutData

export class WorkoutData {
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
  static pwPopup = null;

  constructor(node) {
    this.node = node;
    this.dropdownBtn = this.node.querySelector(".settings-dropdown-btn");
    this.dropdownCon = this.node.querySelector(".settings-dropdown");
    
    if (this.node.id === "profile") {
      this.changePasswordBtn = this.node.querySelector(".change-password");
      this.pwPopup = document.querySelector("form");
      Setting.pwPopup = this.pwPopup;
      this.logoutBtn = this.node.querySelector(".log-out")
      this.changePasswordEvent();
      this.logoutEvent();

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
      this.dropdownCon.classList.toggle("active")
    });
  }

  changePasswordEvent() {
    this.changePasswordBtn.addEventListener("click", () => {
      darkenBg.classList.remove("hidden");
      this.pwPopup.classList.toggle("active");
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
          updateAppSettings(userID, color.getAttribute('data-color'));
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

  logoutEvent() {
    this.logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/"; 
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

//#region Change Password Form

export class ChangePasswordForm {
  static inputs = [];
  constructor() {
    this.form = document.querySelector("form");
    this.inputs = document.querySelectorAll("input");
    this.handleInputs();
  }

  handleInputs() {
    this.inputs.forEach((input) => {
      if (input.id === "newPassword") {
        input.addEventListener("keyup", (event) => this.checkPassword(event));
        ChangePasswordForm.inputs.push(input);
      } else if (input.id === "oldPassword") {
        ChangePasswordForm.inputs.push(input);
      }
    });
  }

  checkPassword(event) {
    const password = event.target.value;
    const feedback = document.querySelector('#p-info');

    const rules = {
      length: password.length > 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?";':{}|<>]/.test(password)
    };
    
    const messages = [];
    if (!rules.length) messages.push("Password must be longer than 8 characters.");
    if (!rules.uppercase) messages.push("Password must contain at least one uppercase letter.");
    if (!rules.lowercase) messages.push("Password must contain at least one lowercase letter.");
    if (!rules.number) messages.push("Password must contain at least one number.");
    if (!rules.specialChar) messages.push("Password must contain at least one special character.");
    if (messages.length === 0) {
      feedback.style.display = 'none';
    } else {
      feedback.style.display = 'block';
      feedback.innerHTML = messages.join('<br>');
    }
    this.handleForm();
  }

  handleForm() {
    let submitButton;

    const formInputs = this.form.querySelectorAll("input");
    let inputsChecked = true;

    const formFeedbacks = this.form.querySelectorAll("div");
    let feedbacksChecked = true;

    formInputs.forEach((input) => {
      if (!input.value) {
        inputsChecked = false;
      }
      if (input.type === "submit") {
        submitButton = input;
      }
    });

    formFeedbacks.forEach((feedback) => {
      if (feedback.style.display !== "none") {
        feedbacksChecked = false;
      }
    });

    if (feedbacksChecked === true && inputsChecked === true) {
      return submitButton.disabled = false;
    } 
    submitButton.disabled = true;
  }

  static closeForm() {
    darkenBg.classList.add("hidden");
    Setting.pwPopup.classList.toggle("active");
    ChangePasswordForm.inputs.forEach((input) => {
      input.value = "";
    });
  }
}

new ChangePasswordForm();

//#endregion

//#region Additional Functions

export function handleNameChange(event) {
  const popupName = document.querySelector(".popup-name");
  const btnWrapper = document.querySelector(".button-wrapper");
  btnWrapper.style.display = "none";
  popupName.style.display = "flex";
  nameInput.placeholder =  findWorkoutByID(event).querySelector('p').textContent;
}

export function deleteWorkout(event) {
  putWorkout(btnWrapper.id, userID, "delete",);
  findWorkoutByID(event).remove();
  darkenBg.classList.toggle("hidden");
  btnWrapper.style.display = "none";
}

export function createNewWorkout() {
  sendWorkout("New Workout", userID);
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

document.getElementById("change-pw-form").addEventListener("submit", changePassword);

//#endregion

export {root};
