import express from 'express';
import * as mb from './database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const upload = multer();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8080;

app.use(express.static('src'));
app.use(upload.none());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

async function getExercises(req, res) {
  res.json(await mb.listExercises());
}

async function getExercise(req, res) {
  const result = await mb.findExercise(req.params.exerciseName);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

async function getWorkouts(req, res) {
  res.json(await mb.listWorkouts());
}

async function getWorkout(req, res) {
  const result = await mb.findWorkout(req.params.workoutID);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

async function postWorkout(req, res) {
  const workoutName = req.body.workoutName;
  const workouts = await mb.addWorkout(workoutName);
  res.json(workouts);
}

async function putWorkout(req, res) {
  const id = req.body.workoutID;

  let workouts;
  if(req.body.timesFinished >= 0) {
    const timesFinished = req.body.timesFinished;
    workouts = await mb.editWorkout(null, id, null, null, timesFinished);
    return res.json(workouts);
  }
  if (req.body.workoutName) {
    const workoutName = req.body.workoutName;
    if (req.body.exerciseList) {
      const exerciseList = JSON.parse(req.body.exerciseList);
      const restTimeList = JSON.parse(req.body.restTimeList);
      workouts = await mb.editWorkout(workoutName, id, exerciseList, restTimeList);
      return res.json(workouts);
    } else {
      workouts = await mb.editWorkout(workoutName, id);
      return res.json(workouts);
    };
  };
  workouts = await mb.deleteWorkout(id);
  res.json(workouts);
}

async function getPrivacyPolicy(req, res) {
  const filePath = path.join(__dirname, 'src', 'contents', 'jsons', 'privacy-policy.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return res.status(500).send({ error: 'Failed to read file' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
}

app.get('/exercises', getExercises);
app.get('/exercises/:exerciseName', getExercise);
app.get('/workouts', getWorkouts);
app.get('/workouts/:workoutID', getWorkout);
app.get('/privacy-policy.json', getPrivacyPolicy);
app.post('/workouts', postWorkout);
app.put('/workouts/:workoutID', putWorkout);
