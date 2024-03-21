'use strict'

import { createInstructions } from "./contentManager.js";
import { fetchExerciseByID } from "./dataHandler.js";

const urlParams = new URLSearchParams(window.location.search);
const exerciseName = urlParams.get('exercise');
const exerciseHeader = document.querySelector('.nav-header');
const exerciseGif = document.querySelector('.exercise-gif');
const instructions = document.querySelector('#instruction-list');
const bodyPart = document.querySelector('#body-part');
    
fetchExerciseByID(exerciseName)
    .then(data => {
        exerciseHeader.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        exerciseGif.src = data.url;
        bodyPart.textContent = bodyPart.textContent + data.body_part;
        createInstructions(data, instructions);
    })
    .catch(error => {
        console.error('Error fetching exercise data:', error);
    });

    localStorage.setItem("pageIndex", 0);