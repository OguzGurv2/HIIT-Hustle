"use strict";

import { fixContentLength, capitalizeWords } from "./contentManager.js";
import { fetchExercises, fetchWorkouts } from "./dataHandler.js";

const exerciseGrid = document.querySelector("#exercise-grid");
const workoutRows = document.querySelector("#workout-rows");

fetchExercises()
  .then((exercises) => {
    exercises.forEach((exercise) => {
      const exerciseCon = document.createElement("a");
      exerciseCon.classList.add("grid-container");
      exerciseCon.classList.add("child");
      exerciseCon.id = exercise.name;
      exerciseCon.href = `exercise.html?exercise=${exercise.name}`;

      const exerciseGif = document.createElement("img");
      exerciseGif.classList.add("exercise-gif");
      exerciseGif.src = exercise.url;

      const exerciseP = document.createElement("p");
      exerciseP.classList.add("exercise-p");
      const editedName = capitalizeWords(exercise.name.split(/-/));
      exerciseP.textContent = editedName;

      exerciseCon.appendChild(exerciseGif);
      exerciseCon.appendChild(exerciseP);
      exerciseGrid.appendChild(exerciseCon);
    });
    fixContentLength();
  })
  .catch((error) => {
    console.error("Error fetching exercise data:", error);
  });

fetchWorkouts()
  .then((workouts) => {
    workouts.forEach((workout) => {
      const workoutCon = document.createElement("a");
      workoutCon.classList.add("workout-child");
      workoutCon.id = workout.name;
      workoutCon.href = `workout.html?workout=${workout.id}`;

      const workoutP = document.createElement("p");

      let words = workout.name.split(/-/);

      let workoutName = words
        .map((word) => {
          if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          } else {
            return word;
          }
        })
        .join(" ");

      workoutP.textContent = workoutName;
        
      workoutCon.appendChild(workoutP);
      workoutRows.appendChild(workoutCon);
    });
    fixContentLength();
  })
  .catch((error) => {
    console.error("Error fetching workout data:", error);
  });
