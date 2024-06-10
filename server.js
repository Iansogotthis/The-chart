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
app.use(cors());
// Database setup
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE squares (class TEXT, parent TEXT, depth INTEGER, title TEXT, plane TEXT, purpose TEXT, delineator TEXT, notations TEXT, details TEXT, extraData TEXT)"
  );
});

// API to save square data
// Improved /save_data endpoint
app.post("/save_data", (req, res) => {
  const { id, class: squareClass, parent, depth, title, plane, purpose, delineator, notations, details, extraData } = req.body;

  if (id) {
    // Check if the square exists
    db.get("SELECT id FROM squares WHERE id = ?", [id], function(err, row) {
      if (err) {
        return res.json({ success: false, error: err.message });
      }
      if (row) {
        // Update existing square
        const sql = `UPDATE squares SET class = ?, parent = ?, depth = ?, title = ?, plane = ?, purpose = ?, delineator = ?, notations = ?, details = ?, extraData = ? WHERE id = ?`;
        db.run(sql, [squareClass, parent, depth, title, plane, purpose, delineator, notations, details, extraData, id], function(err) {
          if (err) {
            res.json({ success: false, error: err.message });
          } else {
            res.json({ success: true, message: "Square updated successfully." });
          }
        });
      } else {
        res.json({ success: false, message: "Square not found." });
      }
    });
  } else {
    // Insert new square
    const sql = `INSERT INTO squares (class, parent, depth, title, plane, purpose, delineator, notations, details, extraData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [squareClass, parent, depth, title, plane, purpose, delineator, notations, details, extraData], function(err) {
      if (err) {
        res.json({ success: false, error: err.message });
      } else {
        res.json({ success: true, message: "Square saved successfully." });
      }
    });
  }
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
