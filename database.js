import fs from 'fs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import util from 'util';
import uuid from 'uuid-random';

fs.renameAsync = fs.renameAsync || util.promisify(fs.rename);

async function init() {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
      verbose: true,
    });
    await db.migrate({ migrationsPath: './src/contents/migrations' });
    return db;
  }
const dbConn = init();

export async function findUser(id) {
  const db = await dbConn;
  const user = db.get('SELECT * FROM users WHERE user_id = ?', id);
  return user;
}

export async function findUserByEmail(email, password) {
  const db = await dbConn;
  const row = await db.get('SELECT * FROM users WHERE email = ?', email);
  if (!row) {
    throw new Error('User not found');
  }
  if (row.password !== password) {
    throw new Error('Password is not correct');
  }
  return row;
}

export async function addUser(email, username, password) {
  const db = await dbConn;
  const existingUser = await db.get('SELECT email FROM users WHERE email = ?', email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  try {
    const id = uuid();
    await db.run('INSERT INTO users (user_id, username, email, password, theme_color) VALUES (?, ?, ?, ?, ?)', [id, username, email, password, "#6883BA"]);
    return findUser(id);
  } catch (error) {
    console.error("Error adding user to DB:", error);
    throw error; 
  }
}

export async function editAppSettings(id, themeColor) {
  const db = await dbConn;
  
  const statement = await db.run('UPDATE users SET theme_color = ? WHERE user_id = ?', [themeColor, id]);
  if (statement.changes === 0) throw new Error('user not found');
}

export async function editUserSettings(userID, oldPassword, newPassword) {
  const db = await dbConn;
  try {
    const row = await db.get('SELECT password FROM users WHERE user_id = ?', userID);
    if (!row) {
      return "User not found"; 
    }

    if (row.password !== oldPassword) {
      return "Old password didn't match";  
    }

    if (oldPassword === newPassword) {
      return "New password should not be same with the old one"; 
    }

    const result = await db.run('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, userID]);
    if (result.changes === 0) {
      return "No changes were made";  
    }
    return "Password changed successfully";  
  } catch (error) {
    return "Server error";  
  }
}

export async function listExercises() {
  const db = await dbConn;
  const exercises = await db.all('SELECT name, url, duration FROM exercises');
  return exercises;
}
  
export async function findExercise(exerciseName) {
  const db = await dbConn;
  const exercise = db.get('SELECT * FROM exercises WHERE name = ?', exerciseName);
  return exercise;
}

export async function listWorkoutsByUserID(userID) {
  const db = await dbConn;
  const workouts = await db.all('SELECT workout_id, name, times_finished FROM workouts WHERE user_id = ? AND is_deleted = 0', [userID]);
  return workouts;
}

export async function findWorkout(id) {
  const db = await dbConn;
  const workout = await db.get('SELECT * FROM workouts WHERE workout_id = ? AND is_deleted = FALSE', id);
  return workout;
}

export async function addWorkout(workoutName, userID) {
  const db = await dbConn;
  const workoutID = uuid();
  await db.run('INSERT INTO workouts (workout_id, name, times_finished, user_id) VALUES (?, ?, ?, ?)', [workoutID, workoutName, 0, userID]); 
  return findWorkout(workoutID);
}

export async function editWorkout(workoutName, id, exerciseList, restTimeList, timesFinished) {
  const db = await dbConn;
  
  let statement;
  if (exerciseList) {
    const exerciseListJson = JSON.stringify(exerciseList);
    const restTimeListJson = JSON.stringify(restTimeList);
    statement = await db.run('UPDATE workouts SET name = ? , exercise_list = ?, rest_time_list = ? WHERE workout_id = ? AND is_deleted = FALSE', [workoutName, exerciseListJson, restTimeListJson, id]);
  } else if (timesFinished) {
    statement = await db.run('UPDATE workouts SET times_finished = ? WHERE workout_id = ? AND is_deleted = FALSE', [timesFinished, id]);
  } else {
    statement = await db.run('UPDATE workouts SET name = ? WHERE workout_id = ? AND is_deleted = FALSE', [workoutName, id]);
  }
  if (statement.changes === 0) throw new Error('workout not found');
}

export async function deleteWorkout(workoutID, userID) {
  const db = await dbConn;
  await db.run('UPDATE workouts SET is_deleted = ? WHERE workout_id = ?', [1, workoutID]);
  return listWorkoutsByUserID(userID);
}
