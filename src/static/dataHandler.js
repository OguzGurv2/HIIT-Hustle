'use strict';

import { capitalizeWords, createInstructions } from "./contentManager.js";

export async function fetchExercises() {
    try {
      const response = await fetch('/exercises');
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const exercises = await response.json();
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
}
  
export async function fetchExerciseByID(exerciseName) {
    
    try {
      const response = await fetch(`/exercises/${exerciseName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exercise with name ${exerciseName}`);
      }
      const exercise = await response.json();
      return exercise;
    } catch (error) {
      console.error(`Error fetching exercise with name ${exerciseName}:`, error);
      throw error;
    }
}

export async function fetchWorkouts() {
  try {
    const response = await fetch('/workouts');
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    const workouts = await response.json();
    if (workouts.length === 0) {
      throw new Error('No workouts found');
    }
    return workouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
}

export async function fetchWorkoutByID(workoutID) {
    
  try {
    const response = await fetch(`/workouts/${workoutID}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch workout with id ${workoutID}`);
    }
    const workout = await response.json();
    if (workout.exercise_list != null) {
      workout.exercise_list = JSON.parse(workout.exercise_list);
      workout.rest_time_list = JSON.parse(workout.rest_time_list);
    }
    return workout;
  } catch (error) {
    console.error(`Error fetching workout with id ${workoutID}:`, error);
    throw error;
  }
}

export async function sendWorkout(workoutName) {
  const payload = new FormData();
  payload.append('workoutName', workoutName);

  const response = await fetch('/workouts', {
    method: 'POST',
    body: payload  
  });

  if (response.ok) {
    const workout = await response.json();
    window.location.href = `/workout.html?workout=${workout.id}`;
    console.log('workout successfully posted', response);
  } else {
    console.log('failed to post workout', response);
  }
}

export async function putWorkout(id, event, workoutName, exerciseList, restTimeList) {
  const payload = new FormData();
  payload.append('workoutID', id);

  if (event !== "delete") {
    payload.append('workoutName', workoutName);
    if (exerciseList) {
      payload.append('exerciseList', JSON.stringify(exerciseList));
      payload.append('restTimeList', JSON.stringify(restTimeList));
    };
  } 
  
  const response = await fetch(`/workouts/${id}`, {
    method: 'PUT',
    body: payload  
  });

  if (response.ok) {
    console.log('workout updated successfully');
  } else {
    console.log('failed to updated workout', response);
  }
}

export function editData(data, param) {
  if (param == "exercise") {

    const exerciseCon = document.createElement("a");
    exerciseCon.classList.add("grid-container");
    exerciseCon.classList.add("child");
    exerciseCon.id = data.name;
    
    const exerciseGif = document.createElement("img");
    exerciseGif.classList.add("exercise-gif");
    exerciseGif.src = data.url;
    
    const exerciseP = document.createElement("p");
    exerciseP.classList.add("exercise-p");
    const editedName = capitalizeWords(data.name.split(/-/));
    exerciseP.textContent = editedName;
    
    exerciseCon.appendChild(exerciseGif);
    exerciseCon.appendChild(exerciseP);
    
    if (window.location.pathname === "/") {
      // index.html differences
      const exerciseGrid = document.querySelector("#exercise-grid");
      
      exerciseCon.href = `exercise.html?exercise=${data.name}`;
      exerciseGrid.appendChild(exerciseCon);
      
    } else if (window.location.pathname === "/workout.html") {
      // workout.html differences
      const popupGrid = document.querySelector("#popup-grid");
      const duration = document.createElement("p");
      
      duration.classList.add("exercise-p");
      duration.classList.add("duration");
      duration.textContent = data.duration + "s";

      exerciseCon.appendChild(duration);
      popupGrid.appendChild(exerciseCon);
      return exerciseCon;
    }
  } else if (param == "workout-exercise") {
    const workoutCon = document.querySelector("#workout-content");

    const exerciseCon = document.createElement("div");
    exerciseCon.classList.add("row-child");
    exerciseCon.id = data.name;
    
    const mainDiv = document.createElement("div");
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("content-wrapper");
    const exerciseGif = document.createElement("img");
    exerciseGif.src = data.url;
    const textWrapper = document.createElement("div");
    textWrapper.classList.add("text-wrapper");
    const exerciseName = document.createElement("p");
    const editedName = capitalizeWords(data.name.split(/-/));
    exerciseName.textContent = editedName;
    const duration = document.createElement("span");
    duration.classList.add("duration");
    duration.textContent = data.duration + "s";
    const iconCon = document.createElement("div");
    iconCon.classList.add("icon-container");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-angle-left");
    
    
    iconCon.appendChild(icon);
    textWrapper.appendChild(exerciseName);
    textWrapper.appendChild(duration);
    contentWrapper.appendChild(exerciseGif);
    contentWrapper.appendChild(textWrapper);
    mainDiv.appendChild(contentWrapper);
    mainDiv.appendChild(iconCon);

    const extendableDiv = document.createElement("div");
    extendableDiv.id = "extendable-content";
    
    const instructions = document.createElement("div");
    const instructionsHeader = document.createElement("h2");
    instructionsHeader.textContent = "Instructions";
    instructionsHeader.classList.add("instructions-header");
    instructions.append(instructionsHeader);
    createInstructions(data, instructions);

    const restTime = document.createElement("div");
    restTime.classList.add("restTime");
    const contentDiv = document.createElement("div");
    const subtractIcon = document.createElement("i");
    subtractIcon.classList.add("fa-solid", "fa-minus");
    contentDiv.appendChild(subtractIcon);

    const restDuration = document.createElement("h2");
    restDuration.classList.add("restDuration");
    if (data.restTime) {
      restDuration.textContent = data.restTime + "s";
    } else {
      restDuration.textContent = "5s";
    }
    contentDiv.appendChild(restDuration);

    const plusIcon = document.createElement("i");
    plusIcon.classList.add("fa-solid", "fa-plus");
    contentDiv.appendChild(plusIcon);

    restTime.appendChild(contentDiv);
    extendableDiv.appendChild(instructions);
    extendableDiv.appendChild(restTime);

    exerciseCon.appendChild(mainDiv);
    exerciseCon.appendChild(extendableDiv);
    workoutCon.appendChild(exerciseCon);

    return exerciseCon;
  } else {
    const workoutGrid = document.querySelector(".row-grid");
    const workoutCon = document.createElement("a");
    workoutCon.classList.add("row-child");
    workoutCon.classList.add("workout");
    workoutCon.id = data.id;
    
    const workoutP = document.createElement("p");
    let words = data.name.split(/-/);
    let workoutName = capitalizeWords(words);
    workoutP.textContent = workoutName;
    
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-ellipsis", "options");
    
    workoutCon.appendChild(workoutP);
    workoutCon.appendChild(icon);
    workoutGrid.appendChild(workoutCon);
    return workoutCon;
  }
}
