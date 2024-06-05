const express = require("express");
const cors = require('cors');

const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Database setup
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE squares (class TEXT, parent TEXT, depth INTEGER, title TEXT, plane TEXT, purpose TEXT, delineator TEXT, notations TEXT, details TEXT, extraData TEXT)"
  );
});

// API to save square data
app.post("/save_data", (req, res) => {
  const {
    class: squareClass,
    parent,
    depth,
    title,
    plane,
    purpose,
    delineator,
    notations,
    details,
    extraData,
  } = req.body;
  const stmt = db.prepare(
    "INSERT INTO squares (class, parent, depth, title, plane, purpose, delineator, notations, details, extraData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    squareClass,
    parent,
    depth,
    title,
    plane,
    purpose,
    delineator,
    notations,
    details,
    extraData,
    (err) => {
      if (err) {
        res.json({ success: false, error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
  stmt.finalize();
});

// API to get square data
app.get("/get_data", (req, res) => {
  const { class: squareClass, parent, depth } = req.query;
  db.get(
    "SELECT * FROM squares WHERE class = ? AND parent = ? AND depth = ?",
    [squareClass, parent, depth],
    (err, row) => {
      if (err) {
        res.json({ success: false, error: err.message });
      } else {
        res.json({ success: true, data: row });
      }
    }
  );
});

// Serve the HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
