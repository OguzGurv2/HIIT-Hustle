'use strict';

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
    return workouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
}

export async function fetchWorkoutByID(workoutName) {
    
  try {
    const response = await fetch(`/workouts/${workoutName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch workout with name ${workoutName}`);
    }
    const workout = await response.json();
    workout.exercise_list = JSON.parse(workout.exercise_list);
    return workout;
  } catch (error) {
    console.error(`Error fetching workout with name ${workoutName}:`, error);
    throw error;
  }
}

export async function sendWorkout(workoutName, exerciseList) {
  const payload = new FormData();
  payload.append('workoutName', workoutName);
  payload.append('exerciseList', JSON.stringify(exerciseList));

  const response = await fetch('/workouts', {
    method: 'POST',
    body: payload  
  });

  if (response.ok) {
    console.log('workout posted successfully');
  } else {
    console.log('failed to post workout', response);
  }
}

