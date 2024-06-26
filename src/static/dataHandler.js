"use strict";

import { msgAnim } from "./contentManager.js";
import { ChangePasswordForm } from "./home.js";

// sends POST request to server for user to create new user

export async function sendUser(email, username, password) {
  const payload = new FormData();
  payload.append("email", email);
  payload.append("username", username);
  payload.append("password", password);

  try {
    const response = await fetch("/u/signup", {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      const message = await response.text();
      msgAnim(message);
    } else {
      const json = await response.json();
      console.log("Received user data:", json);
      window.location.href = `/u/${json.user_id}?format=html`;
    }
  } catch (error) {
    console.error("Network or server error:", error);
    alert("Network or server error.");
  }
}

// sends GET request to server for user to login

export async function loginUser(email, password) {
  try {
    const payload = new FormData();
    payload.append("email", email);
    payload.append("password", password);

    const response = await fetch("/u/login", {
      method: "POST",
      body: payload,
    });
    if (!response.ok) {
      const message = await response.text();
      msgAnim(message);
    } else {
      const json = await response.json();
      console.log("Received user data:", json);
      window.location.href = `/u/${json.user_id}?format=html`;
    }
  } catch (error) {
    console.error(`Error fetching user:`, error);
    alert(error);
  }
}

// sends GET request to server for user to fetch data

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

// sends PUT request to server for user to update app settings

export async function updateAppSettings(userID, themeColor) {
  const payload = new FormData();
  payload.append("userID", userID);
  payload.append("themeColor", themeColor);

  const response = await fetch(`/u/app-settings/${userID}`, {
    method: "PUT",
    body: payload,
  });

  if (response.ok) {
    console.log("user updated successfully");
  } else {
    console.log("failed to update user", response);
  }
}

// sends PUT request to server for user to change password

export async function changePassword(event) {
  event.preventDefault();
  const payload = new FormData();
  const userID = event.target.querySelector("#userID").value;
  const oldPassword = event.target.querySelector("#oldPassword").value;
  const newPassword = event.target.querySelector("#newPassword").value;
  payload.append("userID", userID);
  payload.append("oldPassword", oldPassword);
  payload.append("newPassword", newPassword);

  const response = await fetch("/u/settings/change-password", {
    method: "PUT",
    body: payload,
  });

  const text = await response.text();
  msgAnim(text);
  ChangePasswordForm.closeForm();
}

// sends GET request to server for fetching exercises

export async function fetchExercises() {
  try {
    const response = await fetch("/exercises");
    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }
    const exercises = await response.json();
    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
}

// sends GET request to server for fetching an exercise by id

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

// sends GET request to server for fetching workouts

export async function fetchWorkouts(userID) {
  try {
    const response = await fetch(`/workouts/user/${userID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch workouts");
    }
    const workouts = await response.json();
    return workouts;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
}

// sends GET request to server for fetching a workout by id

export async function fetchWorkoutByID(workoutID) {
  try {
    const response = await fetch(`/workouts/workout/${workoutID}`);
    if (!response.ok) {
      throw new Error(
        `HTTP status ${response.status}: Failed to fetch workout with id ${workoutID}`
      );
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

// sends POST request to server for creating a workout

export async function sendWorkout(workoutName, userID) {
  const payload = new FormData();
  payload.append("workoutName", workoutName);
  payload.append("userID", userID);
  const response = await fetch("/workouts", {
    method: "POST",
    body: payload,
  });

  if (response.ok) {
    const workout = await response.json();
    window.location.href = `/workout.html?workout=${workout.workout_id}`;
    console.log("workout successfully posted", response);
  } else {
    console.log("failed to post workout", response);
  }
}

// sends PUT request to server for updating a workout

export async function putWorkout(
  workoutID,
  userID,
  event,
  workoutName,
  exerciseList,
  restTimeList,
  timesFinished
) {
  const payload = new FormData();
  payload.append("workoutID", workoutID);
  payload.append("userID", userID);

  if (event === "count") {
    payload.append("timesFinished", timesFinished);
  }
  if (event === "update") {
    payload.append("workoutName", workoutName);
    if (exerciseList) {
      payload.append("exerciseList", JSON.stringify(exerciseList));
      payload.append("restTimeList", JSON.stringify(restTimeList));
    }
  }

  const response = await fetch(`/workouts/workout/${workoutID}`, {
    method: "PUT",
    body: payload,
  });

  if (response.ok) {
    console.log("workout updated successfully");
  } else {
    console.log("failed to update workout", response);
  }
}

// sends GET request to server for fetching privacy-policy text

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
