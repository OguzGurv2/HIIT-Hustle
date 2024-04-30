'use strict';

import { capitalizeWords, msgAnim, createInstructions } from "./contentManager.js";
import { ChangePasswordForm } from "./home.js";

export async function sendUser(email, username, password) {
  const payload = new FormData();
  payload.append('email', email);
  payload.append('username', username);
  payload.append('password', password);

  const response = await fetch('/u', {
    method: 'POST',
    body: payload  
  });

  if (response.ok) {
    window.location.href = "/";
    console.log('user successfully posted', response);
  } else {
    console.log('failed to send user', response);
  }
}

export async function fetchUser(id) {
  try {
    const response = await fetch(`/u/${id}?format=json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
}

export async function updateAppSettings(userID, themeColor) {
  const payload = new FormData();
  payload.append('userID', userID);
  payload.append('themeColor', themeColor);

  const response = await fetch(`/u/app-settings/${userID}`, {
    method: 'PUT',
    body: payload  
  });

  if (response.ok) {
    console.log('user updated successfully');
  } else {
    console.log('failed to update user', response);
  }
}

export async function changePassword(event) {
  event.preventDefault();
  const payload = new FormData();
  const userID = event.target.querySelector("#userID").value;
  const oldPassword = event.target.querySelector("#oldPassword").value;
  const newPassword = event.target.querySelector("#newPassword").value;
  payload.append('userID', userID);
  payload.append('oldPassword', oldPassword);
  payload.append('newPassword', newPassword);

  const response = await fetch('/u/settings/change-password', {
      method: 'PUT',
      body: payload
  });

  const text = await response.text();
  msgAnim(text);
  ChangePasswordForm.closeForm();
}

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

export async function fetchWorkouts(userID) {
  try {
    const response = await fetch(`/workouts/user/${userID}`);
    if (!response.ok) {
        throw new Error('Failed to fetch workouts');
    }
    const workouts = await response.json();
    return workouts;
  } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
  }
}

export async function fetchWorkoutByID(workoutID) {
    
  try {
    const response = await fetch(`/workouts/workout/${workoutID}`);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}: Failed to fetch workout with id ${workoutID}`);
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

export async function sendWorkout(workoutName, userID) {
  const payload = new FormData();
  payload.append('workoutName', workoutName);
  payload.append('userID', userID)
  const response = await fetch('/workouts', {
    method: 'POST',
    body: payload  
  });

  if (response.ok) {
    const workout = await response.json();
    window.location.href = `/workout.html?workout=${workout.workout_id}`;
    console.log('workout successfully posted', response);
  } else {
    console.log('failed to post workout', response);
  }
}

export async function putWorkout(workoutID, userID, event, workoutName, exerciseList, restTimeList, timesFinished) {
  const payload = new FormData();
  payload.append('workoutID', workoutID);
  payload.append('userID', userID);

  if (event === "count") {
    payload.append('timesFinished', timesFinished);
  }
  if (event === "update") {
    payload.append('workoutName', workoutName);
    if (exerciseList) {
      payload.append('exerciseList', JSON.stringify(exerciseList));
      payload.append('restTimeList', JSON.stringify(restTimeList));
    };
  }

  const response = await fetch(`/workouts/workout/${workoutID}`, {
    method: 'PUT',
    body: payload  
  });

  if (response.ok) {
    console.log('workout updated successfully');
  } else {
    console.log('failed to update workout', response);
  }
}

export async function fetchPrivacyPolicy() {
  try {
    const response = await fetch(`/privacy-policy.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Privacy Policy`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching Privacy Policy:`, error);
    throw error;
  }
}
