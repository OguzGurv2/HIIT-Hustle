import express from 'express';
import * as mb from './database.js';
import multer from 'multer';

const app = express();
const upload = multer();
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

app.get('/exercises', getExercises);
app.get('/exercises/:exerciseName', getExercise);
app.get('/workouts', getWorkouts);
app.get('/workouts/:workoutID', getWorkout);
app.post('/workouts', postWorkout);
app.put('/workouts/:workoutID', putWorkout);
