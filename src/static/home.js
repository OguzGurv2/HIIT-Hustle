"use strict";

import {
  addEventListenersToContents,
  findWorkoutByID,
  fixContentLength,
  Exercise,
  capitalizeWords,
} from "./contentManager.js";
import {
  fetchExercises,
  fetchWorkouts,
  putWorkout,
  sendWorkout,
  fetchPrivacyPolicy,
  fetchUser,
  updateAppSettings,
  changePassword,
} from "./dataHandler.js";

// global variables for initializing the webpage
const darkenBg = document.querySelector(".darken-background");
const editName = document.querySelector("#edit-name");
const nameInput = document.querySelector("#name-input");
const btnWrapper = document.querySelector(".button-wrapper");
const createWorkout = document.querySelector("#create-workout");
const root = document.documentElement;
const url = new URL(window.location.href);
const pathSegments = url.pathname.split("/");
const userID = pathSegments[pathSegments.length - 1];
const closeBtns = document.querySelectorAll(".close");

//#region Initialize Webpage

// initializes the webpage depending on the url parameter
if (
  userID !== "exercise.html" &&
  userID !== "workout.html" &&
  userID !== "accessControl.html" &&
  userID !== ""
) {
  // fetchs user data and stores them in localStorage
  fetchUser(userID).then((user) => {
    localStorage.setItem("userID", user.user_id);
    localStorage.setItem("themeColor", user.theme_color);

    root.style.setProperty("--secondary", user.theme_color);

    const usernames = document.querySelectorAll(".username");
    usernames.forEach((username) => {
      username.textContent = user.username + username.textContent;
    });

    const pwID = document.querySelector("#userID");
    pwID.value = user.user_id;
  });

  // fetchs exercises data and renders them with Exercise Class
  fetchExercises()
    .then((exercises) => {
      exercises.forEach((exercise) => {
        const exerciseElem = new Exercise(exercise);
        exerciseElem.renderHomeAndWorkoutPage();
      });
      const childList = document.querySelectorAll(".child");
      fixContentLength(childList);
    })
    .catch((error) => {
      console.error("Error fetching exercise data:", error);
    });

  // fetchs workouts data and renders them with Workout Class
  fetchWorkouts(userID)
    .then((workouts) => {
      if (workouts.length >= 10) {
        createWorkout.classList.add("hidden");
      }
      if (workouts.length >= 1) {
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

  const deleteWorkoutBtn = document.querySelector("#delete-workout");
  document
    .getElementById("change-pw-form")
    .addEventListener("submit", changePassword);

  addEventListenersToContents(createWorkout);
  addEventListenersToContents(darkenBg);
  addEventListenersToContents(editName);
  addEventListenersToContents(nameInput);
  addEventListenersToContents(deleteWorkoutBtn);
  closeBtns.forEach((button) => {
    addEventListenersToContents(button);
  })
  privacyPolicyText();
}

//#endregion

//#region Workout Class

export class Workout {
  static workoutElems = [];

  constructor(data) {
    this.data = data;
    this.node = null;
    this.icon = null;
    this.content = null;
  }

  // renders workouts
  render() {
    const template = document.querySelector(".workout");
    const content = template.content.cloneNode(true);
    this.node = document.importNode(content, true).firstElementChild;
    const workoutGrid = document.querySelector(".row-grid");
    workoutGrid.appendChild(this.node);

    this.node.id = this.data.workout_id;

    this.content = this.node.querySelector("p");
    let words = this.data.name.split(/-/);
    let workoutName = capitalizeWords(words);
    this.content.textContent = workoutName;

    this.icon = this.node.querySelector("i");
    this.handleOption();
    this.openWorkout();
    Workout.workoutElems.push(this.node);
  }

  // handles options for workouts
  handleOption() {
    this.icon.addEventListener("click", () => {
      darkenBg.classList.toggle("hidden");
      btnWrapper.style.display = "grid";
      btnWrapper.id = this.data.workout_id;
    });
  }

  // opens workouts by their ids in workout.html via url param
  openWorkout() {
    this.content.addEventListener("click", () => {
      window.location.href = `/workout.html?workout=${this.data.workout_id}`;
    });
  }
}

//#endregion

//#region WorkoutData Class

export class WorkoutData {
  static dataList = [];

  constructor(data) {
    this.data = data;
    this.cells = null;
    this.id = data.id;
  }

  // renders workout data in the home "page"
  render() {
    const template = document.querySelector(".workout-data");
    const content = template.content.cloneNode(true);
    this.cells = document.importNode(content, true).firstElementChild;
    const activityData = document.querySelector("#activity-data");
    activityData.appendChild(this.cells);

    this.cells.querySelector(".name-cell").textContent = this.data.name;
    this.cells.querySelector(".data-cell").textContent =
      this.data.times_finished;

    let numericData = parseFloat(this.cells.lastChild.textContent);
    WorkoutData.dataList.push({
      id: this.id,
      cells: this.cells,
      dataCell: numericData,
    });
    WorkoutData.sortDataList();
  }

  // sorts the workout data according to the times finished
  static sortDataList() {
    this.dataList.sort((a, b) => b.dataCell - a.dataCell);
    this.appendDataToTable();
  }

  // appends the workout data cells to the table
  static appendDataToTable() {
    const tBody = document.querySelector("tbody");
    this.dataList.forEach((elem) => {
      tBody.appendChild(elem.cells);
    });
  }
}

//#endregion

//#region Setting Class

class Setting {
  static pwPopup = null;

  // contructs settings according to their ids
  constructor(node) {
    this.node = node;
    this.dropdownBtn = this.node.querySelector(".settings-dropdown-btn");
    this.dropdownCon = this.node.querySelector(".settings-dropdown");

    if (this.node.id === "profile") {
      this.changePasswordBtn = this.node.querySelector(".change-password");
      this.pwPopup = document.querySelector("form");
      Setting.pwPopup = this.pwPopup;
      this.logoutBtn = this.node.querySelector(".log-out");
      this.changePasswordEvent();
      this.logoutEvent();
    } else if (this.node.id === "app-settings") {
      this.colors = this.node.querySelectorAll(".color-swatch");

      if (localStorage.getItem("themeColor")) {
        for (let i = 0; i < this.colors.length; i++) {
          if (
            localStorage.getItem("themeColor") ===
            this.colors[i].getAttribute("data-color")
          ) {
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
      this.privacyText = document.querySelector(".policy-text");
      return this.popupEvent();
    }
    this.dropdownEvent();
  }

  // handles dropdown event for every setting
  dropdownEvent() {
    this.dropdownBtn.addEventListener("click", () => {
      this.dropdownCon.classList.toggle("active");
    });
  }

  // handles changing user password
  changePasswordEvent() {
    this.changePasswordBtn.addEventListener("click", () => {
      darkenBg.classList.remove("hidden");
      this.pwPopup.classList.toggle("active");
    });
  }

  // handles color change for themeColor
  colorSwitchEvent() {
    this.colors.forEach((color) => {
      color.addEventListener("click", () => {
        if (this.selectedColor != color) {
          color.classList.add("selected");
          this.selectedColor.classList.remove("selected");
          this.selectedColor = color;
          root.style.setProperty(
            "--secondary",
            color.getAttribute("data-color")
          );
          if (localStorage.getItem("themeColor")) {
            localStorage.removeItem("themeColor");
          }
          localStorage.setItem("themeColor", color.getAttribute("data-color"));
          updateAppSettings(userID, color.getAttribute("data-color"));
        }
      });
    });
  }

  // handles popup event for changing name
  popupEvent() {
    this.dropdownBtn.addEventListener("click", () => {
      darkenBg.classList.remove("hidden");
      this.privacyText.classList.toggle("active");
    });
  }

  // handles logout
  logoutEvent() {
    this.logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/";
    });
  }
}

// creates settings
const settingsList = document.querySelectorAll("li");
settingsList.forEach((setting) => {
  if (setting.id) {
    new Setting(setting);
  }
});

//#endregion

//#region Change Password Form Class

export class ChangePasswordForm {
  static inputs = [];
  constructor() {
    this.form = document.querySelector("form");
    this.inputs = document.querySelectorAll("input");
    this.handleInputs();
  }

  // handles inputs of change password form
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

  // has the same functionality in the accessControl.js for checking password
  // according to the given rules
  checkPassword(event) {
    const password = event.target.value;
    const feedback = document.querySelector("#p-info");

    const rules = {
      length: password.length > 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?";':{}|<>]/.test(password),
    };

    const messages = [];
    if (!rules.length)
      messages.push("Password must be longer than 8 characters.");
    if (!rules.uppercase)
      messages.push("Password must contain at least one uppercase letter.");
    if (!rules.lowercase)
      messages.push("Password must contain at least one lowercase letter.");
    if (!rules.number)
      messages.push("Password must contain at least one number.");
    if (!rules.specialChar)
      messages.push("Password must contain at least one special character.");
    if (messages.length === 0) {
      feedback.style.display = "none";
    } else {
      feedback.style.display = "block";
      feedback.innerHTML = messages.join("<br>");
    }
    this.handleForm();
  }

  // handles form to submit
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
      return (submitButton.disabled = false);
    }
    submitButton.disabled = true;
  }

  // closes the form after submitting
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

// handles workout name change
export function handleNameChange(event) {
  const popupName = document.querySelector(".popup-name");
  const btnWrapper = document.querySelector(".button-wrapper");
  btnWrapper.style.display = "none";
  popupName.style.display = "flex";
  nameInput.placeholder = findWorkoutByID(event).querySelector("p").textContent;
}

// deletes workout both from front and back end
export function deleteWorkout(event) {
  putWorkout(btnWrapper.id, userID, "delete");
  findWorkoutByID(event).remove();
  darkenBg.classList.toggle("hidden");
  btnWrapper.style.display = "none";
}

// creates a new workout from back end
export function createNewWorkout() {
  sendWorkout("New Workout", userID);
}

// renders the privacy-policy text
function privacyPolicyText() {
  const policyCon = document.querySelector(".policy-text");
  fetchPrivacyPolicy().then((data) => {
    const text = data.description;
    const sentences = text.split(". ");
    let currentParagraph = document.createElement("p");

    sentences.forEach((sentence, index) => {
      if (/^\d/.test(sentence.trim())) {
        policyCon.appendChild(currentParagraph);
        policyCon.appendChild(document.createElement("br"));

        const h3 = document.createElement("h3");
        const edittedSentence = sentence.replace(/(\d+)(\s)/, "$1.$2");
        h3.textContent = edittedSentence + ":";
        policyCon.appendChild(h3);
        policyCon.appendChild(document.createElement("br"));

        return (currentParagraph = document.createElement("p"));
      } else if (sentence.includes(":")) {
        policyCon.appendChild(currentParagraph);
        currentParagraph = document.createElement("p");

        return (currentParagraph.textContent = sentence);
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

export { root };
