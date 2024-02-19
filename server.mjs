import express from 'express';
import open from 'open';
import db from './database.js'

const app = express();
const PORT = 8080;

app.use(express.static('src'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

app.get('/exercises', (req, res) => {
  db.all('SELECT * FROM exercises', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/exercises/:exerciseID', (req, res) => {
    const exerciseID = req.params.exerciseID;

  db.get('SELECT * FROM exercises WHERE name = ?', [exerciseID], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(row);
  });
});

open(`http://localhost:${PORT}/`);
