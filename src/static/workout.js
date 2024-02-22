"use strict";

import { fetchExercises } from './fetchData.js';
import { fixContentLength, addClickEventToContent } from './contentManager.js';

const popupGrid = document.querySelector('#popup-grid');
const darkenBg = document.querySelector('#darken-background');
const popupWrapper = document.querySelector('#popup-wrapper');

fetchExercises()
.then(exercises => {
  exercises.forEach(exercise => { 
    const exerciseCon = document.createElement('a');
    exerciseCon.classList.add("grid-container");
    exerciseCon.classList.add("child");
    exerciseCon.id = exercise.name;
    
    const exerciseGif = document.createElement('img');
    exerciseGif.classList.add("exercise-gif");
    exerciseGif.src = exercise.url;
    
    const exerciseP = document.createElement('p');
    exerciseP.classList.add("exercise-p");
    
    let words = exercise.name.split(/-/);
    
    let exerciseName = words.map(word => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    }).join(' ');
    
    exerciseP.textContent = exerciseName;
    
    exerciseCon.appendChild(exerciseGif);
    exerciseCon.appendChild(exerciseP);
    popupGrid.appendChild(exerciseCon);
  });
  fixContentLength();
  addClickEventToContent();
})
.catch(error => {
  console.error('Error fetching exercise data:', error);
});

document.querySelector('#popup-btn').addEventListener("click", () => {
  
  darkenBg.classList.remove('hidden');
  popupWrapper.classList.remove("hidden");
});

darkenBg.addEventListener("click", () => {

  darkenBg.classList.add('hidden');
  popupWrapper.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("pageIndex", 1);
});
