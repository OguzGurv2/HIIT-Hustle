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

app.use(upload.none());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

async function getUser(req, res) {
  try {
    const result = await mb.findUser(req.params.id);
    if (!result) {
      return res.status(404).send('No user found.');
    } 
    if (req.query.format === 'json') {
      res.json(result);  
    } else {
      res.sendFile(path.join(__dirname, 'src', 'home.html'));  
    }
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    res.status(500).send("Internal server error");
  }
}

async function postUser(req, res) {
  try {
    const { email, username, password } = req.body;
    const user = await mb.addUser(email, username, password);
    res.redirect(`/u/${user.user_id}?format=html`);
  } catch (error) {
    console.error("Failed to add user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function putAppSettings(req, res) {
  const userID = req.body.userID;
  
  const themeColor = req.body.themeColor;
  const user = await mb.editAppSettings(userID, themeColor);
  res.json(user);
}

async function putUserSettings(req, res) {
  const { userID, oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || !userID) {
    return res.send("All fields are required."); 
  }

  const message = await mb.editUserSettings(userID, oldPassword, newPassword);
  res.send(message);
}

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
  try {
    const { userID } = req.params;
    const workouts = await mb.listWorkoutsByUserID(userID);
    res.json(workouts);
  } catch (error) {
    console.error("Failed to retrieve workouts:", error);
    res.status(500).send("Internal server error");
  } 
}

async function getWorkout(req, res) {
  try {
    const result = await mb.findWorkout(req.params.workoutID);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("No workout found.");
    }
  } catch (error) {
    console.error("Failed to retrieve workout:", error);
    res.status(500).send("Internal server error");
  } 
}

async function postWorkout(req, res) {
  const workoutName = req.body.workoutName;
  const userID = req.body.userID;
  const workout = await mb.addWorkout(workoutName, userID);
  res.json(workout);
}

async function putWorkout(req, res) {
  const workoutID = req.body.workoutID;
  
  let workouts;
  if(req.body.timesFinished >= 0) {
    const timesFinished = req.body.timesFinished;
    workouts = await mb.editWorkout(null, workoutID, null, null, timesFinished);
    return res.json(workouts);
  }
  if (req.body.workoutName) {
    const workoutName = req.body.workoutName;
    if (req.body.exerciseList) {
      const exerciseList = JSON.parse(req.body.exerciseList);
      const restTimeList = JSON.parse(req.body.restTimeList);
      workouts = await mb.editWorkout(workoutName, workoutID, exerciseList, restTimeList);
      return res.json(workouts);
    } else {
      workouts = await mb.editWorkout(workoutName, workoutID);
      return res.json(workouts);
    };
  };
  const userID = req.body.userID;
  workouts = await mb.deleteWorkout(workoutID, userID);
  res.json(workouts);
}

async function getPrivacyPolicy(req, res) {
  const filePath = path.join(__dirname, 'src', 'contents', 'jsons', 'privacy-policy.json');
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).send({ error: 'Failed to read file' });
  }
}

app.get('/u/:id', getUser);
app.post('/u', postUser);
app.put('/u/app-settings/:userID', putAppSettings);
app.put('/u/settings/change-password', putUserSettings);
app.get('/exercises', getExercises);
app.get('/exercises/:exerciseName', getExercise);
app.get('/workouts/user/:userID', getWorkouts)
app.get('/workouts/workout/:workoutID', getWorkout);
app.post('/workouts', postWorkout);
app.put('/workouts/workout/:workoutID', putWorkout);
app.get('/privacy-policy.json', getPrivacyPolicy);
