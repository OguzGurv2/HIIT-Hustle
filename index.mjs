import express from 'express';
import open from 'open';
import fs from 'fs';

const app = express();
const PORT = 8080;

const exercisesData = JSON.parse(fs.readFileSync('src/content/json/exercises.json', 'utf-8'));

app.use(express.static('src'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

app.get('/exercises', (req, res) => {
  res.json(exercisesData);
});

open(`http://localhost:${PORT}/`);
