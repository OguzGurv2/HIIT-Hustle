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

export async function listWorkouts() {
  const db = await dbConn;
  const workouts = await db.all('SELECT id, name FROM workouts WHERE is_deleted = FALSE');
  return workouts;
}

export async function findWorkout(id) {
  const db = await dbConn;
  const workout = db.get('SELECT * FROM workouts WHERE id = ? AND is_deleted = FALSE', id);
  return workout;
}

export async function addWorkout(workoutName, exerciseList) {
  const db = await dbConn;

  const id = uuid();
  const exerciseListJson = JSON.stringify(exerciseList);
  await db.run('INSERT INTO workouts VALUES (?, ?, ?, ?)', [id, workoutName, exerciseListJson, 0]); 
  
  return findWorkout(id); 
}

export async function editWorkout(workoutName, id, exerciseList ) {
  const db = await dbConn;
  
  let statement;
  if (exerciseList) {
    const exerciseListJson = JSON.stringify(exerciseList);
    statement = await db.run('UPDATE workouts SET name = ? , exercise_list = ? WHERE id = ? AND is_deleted = FALSE', [workoutName, exerciseListJson, id]);
  } else {
    statement = await db.run('UPDATE workouts SET name = ? WHERE id = ? AND is_deleted = FALSE', [workoutName, id]);
  }
  if (statement.changes === 0) throw new Error('workout not found');
  return findWorkout(id);
}

export async function deleteWorkout(id) {
  const db = await dbConn;
  await db.run('UPDATE workouts SET is_deleted = ? WHERE id = ?', [1, id]);
  return listWorkouts();
}
