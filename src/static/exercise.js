'use strict'

import { addEventListenersToContents, Exercise } from "./contentManager.js";
import { fetchExerciseByID } from "./dataHandler.js";
import {root} from "./home.js";

const urlParams = new URLSearchParams(window.location.search);
const exerciseName = urlParams.get('exercise');
const exerciseHeader = document.querySelector('.nav-header');
const exerciseGif = document.querySelector('.exercise-gif');
const instructions = document.querySelector('#instruction-list');
const bodyPart = document.querySelector('#body-part');
const navBtn = document.querySelector(".nav-btn");

if (exerciseName) {
    addEventListenersToContents(navBtn);
    localStorage.setItem("pageIndex", 0);

    if (localStorage.getItem("themeColor")) {
        root.style.setProperty('--secondary', localStorage.getItem("themeColor"));
    } 

    fetchExerciseByID(exerciseName)
    .then(data => {
        const exerciseElem = new Exercise(data);
        exerciseElem.renderExercisePage();
    })
    .catch(error => {
        console.error('Error fetching exercise data:', error);
    });
}   

export { exerciseHeader, exerciseGif, instructions, bodyPart };
