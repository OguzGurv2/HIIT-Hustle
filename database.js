import { createClient } from '@libsql/client';
import uuid from 'uuid-random';

// initializes the database client
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// finds user by id from database
export async function findUser(id) {
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE user_id = ?', args: [id] });
  return result.rows[0];
}

// finds user by email from database
export async function findUserByEmail(email, password) {
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
  const row = result.rows[0];

  if (!row) {
    throw new Error('User not found');
  }
  if (row.password !== password) {
    throw new Error('Password is not correct');
  }
  return row;
}

// adds user to database
export async function addUser(email, username, password) {
  const existing = await db.execute({ sql: 'SELECT email FROM users WHERE email = ?', args: [email] });
  if (existing.rows[0]) {
    throw new Error('Email already exists');
  }
  try {
    const id = uuid();
    await db.execute({
      sql: 'INSERT INTO users (user_id, username, email, password, theme_color) VALUES (?, ?, ?, ?, ?)',
      args: [id, username, email, password, '#6883BA'],
    });
    return findUser(id);
  } catch (error) {
    console.error('Error adding user to DB:', error);
    throw error;
  }
}

// updates app settings according to the user id from database
export async function editAppSettings(id, themeColor) {
  const result = await db.execute({
    sql: 'UPDATE users SET theme_color = ? WHERE user_id = ?',
    args: [themeColor, id],
  });
  if (result.rowsAffected === 0) throw new Error('user not found');
}

// updates user settings according to the user id from database
export async function editUserSettings(userID, oldPassword, newPassword) {
  try {
    const result = await db.execute({ sql: 'SELECT password FROM users WHERE user_id = ?', args: [userID] });
    const row = result.rows[0];
    if (!row) {
      return 'User not found';
    }

    if (row.password !== oldPassword) {
      return "Old password didn't match";
    }

    if (oldPassword === newPassword) {
      return 'New password should not be same with the old one';
    }

    const update = await db.execute({
      sql: 'UPDATE users SET password = ? WHERE user_id = ?',
      args: [newPassword, userID],
    });
    if (update.rowsAffected === 0) {
      return 'No changes were made';
    }
    return 'Password changed successfully';
  } catch (error) {
    return 'Server error';
  }
}

// lists the exercises data from database
export async function listExercises() {
  const result = await db.execute('SELECT name, url, duration FROM exercises');
  return result.rows;
}

// finds exercise by id from database
export async function findExercise(exerciseName) {
  const result = await db.execute({ sql: 'SELECT * FROM exercises WHERE name = ?', args: [exerciseName] });
  return result.rows[0];
}

// lists workouts by user id from database
export async function listWorkoutsByUserID(userID) {
  const result = await db.execute({
    sql: 'SELECT workout_id, name, times_finished FROM workouts WHERE user_id = ? AND is_deleted = 0',
    args: [userID],
  });
  return result.rows;
}

// finds workout by id from database
export async function findWorkout(id) {
  const result = await db.execute({
    sql: 'SELECT * FROM workouts WHERE workout_id = ? AND is_deleted = FALSE',
    args: [id],
  });
  return result.rows[0];
}

// adds workout to database
export async function addWorkout(workoutName, userID) {
  const workoutID = uuid();
  await db.execute({
    sql: 'INSERT INTO workouts (workout_id, name, times_finished, user_id) VALUES (?, ?, ?, ?)',
    args: [workoutID, workoutName, 0, userID],
  });
  return findWorkout(workoutID);
}

// updates workout by id from database
export async function editWorkout(workoutName, id, exerciseList, restTimeList, timesFinished) {
  let result;
  if (exerciseList) {
    const exerciseListJson = JSON.stringify(exerciseList);
    const restTimeListJson = JSON.stringify(restTimeList);
    result = await db.execute({
      sql: 'UPDATE workouts SET name = ? , exercise_list = ?, rest_time_list = ? WHERE workout_id = ? AND is_deleted = FALSE',
      args: [workoutName, exerciseListJson, restTimeListJson, id],
    });
  } else if (timesFinished) {
    result = await db.execute({
      sql: 'UPDATE workouts SET times_finished = ? WHERE workout_id = ? AND is_deleted = FALSE',
      args: [timesFinished, id],
    });
  } else {
    result = await db.execute({
      sql: 'UPDATE workouts SET name = ? WHERE workout_id = ? AND is_deleted = FALSE',
      args: [workoutName, id],
    });
  }
  if (result.rowsAffected === 0) throw new Error('workout not found');
}

// deletes workout by user and workout id from database
export async function deleteWorkout(workoutID, userID) {
  await db.execute({ sql: 'UPDATE workouts SET is_deleted = ? WHERE workout_id = ?', args: [1, workoutID] });
  return listWorkoutsByUserID(userID);
}
