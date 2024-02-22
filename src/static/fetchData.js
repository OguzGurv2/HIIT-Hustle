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
  
export async function fetchExerciseByID(exerciseID) {
    
    try {
      const response = await fetch(`/exercises/${exerciseID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exercise with ID ${exerciseID}`);
      }
      const exercise = await response.json();
      return exercise;
    } catch (error) {
      console.error(`Error fetching exercise with ID ${exerciseID}:`, error);
      throw error;
    }
}
