const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// API Routes

// Create a new square
app.post('/your-endpoint', (req, res) => {
  const { title, plane, purpose, delineator, notations, details, extraData, class: squareClass, parent, depth, name, size, color, type, parent_id } = req.body;
  const query = 'INSERT INTO squares (title, plane, purpose, delineator, notations, details, extraData, class, parent, depth, name, size, color, type, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [title, plane, purpose, delineator, notations, details, extraData, squareClass, parent, depth, name, size, color, type, parent_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Get all squares
app.get('/squares', (req, res) => {
  const query = 'SELECT * FROM squares';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Get a single square by ID
app.get('/squares/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM squares WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Square not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Update a square
app.put('/squares/:id', (req, res) => {
  const { id } = req.params;
  const { title, plane, purpose, delineator, notations, details, extraData, class: squareClass, parent, depth, name, size, color, type, parent_id } = req.body;
  const query = 'UPDATE squares SET title = ?, plane = ?, purpose = ?, delineator = ?, notations = ?, details = ?, extraData = ?, class = ?, parent = ?, depth = ?, name = ?, size = ?, color = ?, type = ?, parent_id = ? WHERE id = ?';
  db.query(query, [title, plane, purpose, delineator, notations, details, extraData, squareClass, parent, depth, name, size, color, type, parent_id, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Square updated successfully' });
  });
});

// Delete a square
app.delete('/squares/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM squares WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Square deleted successfully' });
  });
});

// Serve the scaled view page
app.get('/scaled_view.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scaled_view.html'));
});

// Serve the scoped view page
app.get('/scoped_view.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scoped_view.html'));
});

// Default Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});