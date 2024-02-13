'use strict';

const pageContainer = document.querySelector(".page-container");

fetch('/exercises')
      .then(response => response.json())
      .then(exercises => {

        exercises.forEach(exercise => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.classList.add("exercise-container");
            const exerciseGif = document.createElement('img');
            exerciseGif.classList.add("exercise-gif");
            exerciseGif.src = exercise.url;
            const exerciseP = document.createElement('p');
            exerciseP.classList.add("exercise-p");
            exerciseP.textContent = exercise.name
            exerciseDiv.appendChild(exerciseGif);
            exerciseDiv.appendChild(exerciseP);
            pageContainer.appendChild(exerciseDiv);
        });
        fixContentLength();
      })
      .catch(error => {
        console.error('Error fetching exercise data:', error);
      });
    
function fixContentLength(){
    const children = document.querySelectorAll('.exercise-container');

    let maxHeight = 0;
    children.forEach(child => {
        maxHeight = Math.max(maxHeight, child.offsetHeight);
    });

    children.forEach(child => {
        child.style.height = maxHeight + 'px';
    });
};
