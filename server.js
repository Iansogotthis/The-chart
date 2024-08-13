const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000; // Define the port for the server

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Setup MySQL connection pool
r = require('rethinkdb')
r.connect(
  {
    host: process.env.RETHINKDB_HOST || "localhost",
    port: process.env.RETHINKDB_PORT || 28015,
    username: process.env.RETHINKDB_USERNAME || "admin",
    password: process.env.RETHINKDB_PASSWORD || "",
    db: process.env.RETHINKDB_NAME || "test",
  },
  function (err, conn) {
    if (err) throw err;
    r.tableCreate("scquares").run(conn, function (err, res) {
      if (err) throw err;
      console.log(res);
      r.table("squares")
        .insert({ name: "square1" })
        .run(conn, function (err, res) {
          if (err) throw err;
          console.log(res);
        });
    });
  }
);
// API Routes

/**
 * Route to create a new square
 * This endpoint creates a new square in the database with the provided data.
 */
app.post("/squares", async (req, res) => {
  const {
    title,
    plane,
    purpose,
    delineator,
    notations,
    details,
    extraData,
    class: squareClass,
    parent,
    depth,
    name,
    size,
    color,
    type,
    parent_id
  } = req.body;
  const query = `INSERT INTO squares (title, plane, purpose, delineator, notations, details, extraData, class, parent, depth, name, size, color, type, parent_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      conn.query(query, [
        title,
        plane,
        purpose,
        delineator,
        notations,
        details,
        extraData,
        squareClass,
        parent,
        depth,
        name,
        size,
        color,
        type,
        parent_id
      ], (error, results) => {
        conn.release();
        if (error) {
          console.error('Error creating square:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ id: results.insertId });
      });
    });
  } catch (err) {
    console.error('Error creating square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Route to get all squares
 * This endpoint retrieves and returns all squares from the database.
 */
app.get("/squares", async (req, res) => {
  const query = "SELECT * FROM squares";
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      conn.query(query, (error, results) => {
        conn.release();
        if (error) {
          console.error('Error fetching squares:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(results);
      });
    });
  } catch (err) {
    console.error('Error fetching squares:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Route to get a single square by ID
 * This endpoint retrieves a square from the database based on the provided ID.
 */
app.get("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM squares WHERE id = ?";
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      conn.query(query, [id], (error, results) => {
        conn.release();
        if (error) {
          console.error('Error fetching square by ID:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Square not found" });
        }
        res.status(200).json(results[0]);
      });
    });
  } catch (err) {
    console.error('Error fetching square by ID:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Route to update a square
 * This endpoint updates an existing square in the database based on the provided ID and data.
 */
app.put("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    plane,
    purpose,
    delineator,
    notations,
    details,
    extraData,
    class: squareClass,
    parent,
    depth,
    name,
    size,
    color,
    type,
    parent_id
  } = req.body;
  const query = `
    UPDATE squares 
    SET title = ?, plane = ?, purpose = ?, delineator = ?, notations = ?, details = ?, extraData = ?, class = ?, parent = ?, depth = ?, name = ?, size = ?, color = ?, type = ?, parent_id = ?
    WHERE id = ?
  `;
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      conn.query(query, [
        title,
        plane,
        purpose,
        delineator,
        notations,
        details,
        extraData,
        squareClass,
        parent,
        depth,
        name,
        size,
        color,
        type,
        parent_id,
        id
      ], (error) => {
        conn.release();
        if (error) {
          console.error('Error updating square:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: "Square updated successfully" });
      });
    });
  } catch (err) {
    console.error('Error updating square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Route to delete a square
 * This endpoint deletes a square from the database based on the provided ID.
 */
app.delete("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM squares WHERE id = ?";
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      conn.query(query, [id], (error) => {
        conn.release();
        if (error) {
          console.error('Error updating square:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: "Square updated successfully" });
      });
    });
  } catch (err) {
    console.error('Error updating square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Route to delete a square
 * This endpoint deletes a square from the database based on the provided ID.
 */
app.delete("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM squares WHERE id = ?";
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Error getting connection:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      conn.query(query, [id], (error) => {
        conn.release();
        if (error) {
          console.error('Error deleting square:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: "Square deleted successfully" });
      });
    });
  } catch (err) {
    console.error('Error deleting square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});