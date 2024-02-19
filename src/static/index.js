'use strict';

import { fixContentLength } from './contentManager.js';

const gridContainer = document.querySelector("#exercise-grid");

fetch('/exercises')
  .then(response => response.json())
  .then(exercises => {

    exercises.forEach(exercise => {
      const exerciseCon = document.createElement('a');
      exerciseCon.classList.add("grid-container");
      exerciseCon.classList.add("child");
      exerciseCon.id = exercise.name;
      exerciseCon.href = `exercises.html?exercise=${exercise.name}`;

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
      gridContainer.appendChild(exerciseCon);
    });
    fixContentLength();
  })
  .catch(error => {
    console.error('Error fetching exercise data:', error);
  });
