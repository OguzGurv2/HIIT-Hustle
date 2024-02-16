'use strict';

import { fixContentLength } from './contentManager.js';

const gridContainer = document.querySelector("#exercise-grid");

fetch('/exercises')
      .then(response => response.json())
      .then(exercises => {

        exercises.forEach(exercise => {
            const exerciseCon = document.createElement('a');
            exerciseCon.classList.add("exercise-container");
            exerciseCon.id = exercise.id;
            exerciseCon.href = `exercises.html?exercise=${exercise.id}`;

            const exerciseGif = document.createElement('img');
            exerciseGif.classList.add("exercise-gif");
            exerciseGif.src = exercise.url;

            const exerciseP = document.createElement('p');
            exerciseP.classList.add("exercise-p");
            exerciseP.textContent = exercise.name;

            exerciseCon.appendChild(exerciseGif);
            exerciseCon.appendChild(exerciseP);
            gridContainer.appendChild(exerciseCon);
        });
        fixContentLength();
      })
      .catch(error => {
        console.error('Error fetching exercise data:', error);
      });
