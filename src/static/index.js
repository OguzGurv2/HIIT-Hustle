"use strict";

import { fixContentLength, capitalizeWords } from "./contentManager.js";
import { fetchExercises, fetchWorkouts } from "./dataHandler.js";

const exerciseGrid = document.querySelector("#exercise-grid");
const workoutGrid = document.querySelector(".row-grid");

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
    const childList = document.querySelectorAll(".child");
    fixContentLength(childList);
  })
  .catch((error) => {
    console.error("Error fetching exercise data:", error);
  });

fetchWorkouts()
  .then((workouts) => {
    if (workouts.length === 10) {
      const createWorkout = document.querySelector('#create-workout');
      createWorkout.classList.add('hidden');
    }
    workouts.forEach((workout) => {
      const workoutCon = document.createElement("a");
      workoutCon.classList.add("row-child");
      workoutCon.id = workout.name;
      workoutCon.href = `workout.html?workout=${workout.id}`;

      const workoutP = document.createElement("p");

      let words = workout.name.split(/-/);

      let workoutName = capitalizeWords(words);

      workoutP.textContent = workoutName;
        
      workoutCon.appendChild(workoutP);
      workoutGrid.appendChild(workoutCon);
    });
  })
  .catch((error) => {
    console.error("Error fetching workout data:", error);
  });
