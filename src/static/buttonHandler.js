'use strict'

import { exerciseAdded } from "./workoutHandler.js";
import { darkenBg, popupWrapper, popupName, workoutName, saveBtn, title } from './workout.js';

export function handleNameInput(event) {

    if (event.key === "Enter") {
        darkenBg.classList.add("hidden");
        popupName.style.display = "none";
        title.textContent = event.target.value;
        workoutName.textContent = event.target.value;
    }
}

export function handlePopupBtn() {
    darkenBg.classList.remove("hidden");
    popupWrapper.classList.remove("hidden");
  
    if (exerciseAdded) {
      document.querySelectorAll(".delete-exercise").forEach((elem) => {
        elem.classList.add("hidden");
      });
    }
}

export function handleDarkenAnim() {
    darkenBg.classList.add("hidden");
    popupWrapper.classList.add("hidden");
    popupName.style.display = "none";
}

export function handleEditBtn() {
    if (exerciseAdded) {
        document.querySelectorAll(".delete-exercise").forEach((elem) => {
            elem.classList.toggle("hidden");
        });
    }
}

export function handleSave() {
    saveBtn.classList.add("hidden");
}
