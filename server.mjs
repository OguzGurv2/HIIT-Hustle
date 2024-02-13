import express from 'express';
import open from 'open';
import fs from 'fs';

const app = express();
const PORT = 8080;

const exercisesData = JSON.parse(fs.readFileSync('src/contents/json/exercises.json', 'utf-8'));

app.use(express.static('src'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

app.get('/exercises', (req, res) => {
  res.json(exercisesData);
});

app.get('/exercises/:exerciseId', (req, res) => {
  const exerciseId = req.params.exerciseId;

  const exerciseData = exercisesData.find(exercise => exercise.id === exerciseId);
  
  if (!exerciseData) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  res.json(exerciseData);
});

open(`http://localhost:${PORT}/`);
