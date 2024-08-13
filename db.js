const r = require('rethinkdb');
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
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'e11wl4mksauxgu1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: process.env.MYSQL_USER || 'hp0lzrzsnuzjl0ei',
  password: process.env.MYSQL_PASSWORD || 'zvskixvf2bwkvhjh',
  database: process.env.MYSQL_DATABASE || 'bfaxn1uhv9udz7ng',
  port: process.env.MYSQL_PORT || 3306,
  connectionLimit: 5 // Maximum number of connections in the pool
});

// Connect to RethinkDB
const connectToRethinkDB = async () => {
  try {
    const connection = await r.connect({
      host: process.env.RETHINKDB_HOST || 'localhost',
      port: process.env.RETHINKDB_PORT || 28015,
      db: process.env.RETHINKDB_NAME || 'test',
      user: process.env.RETHINKDB_USERNAME || 'admin',
      password: process.env.RETHINKDB_PASSWORD || ''
    });
    console.log('Connected to RethinkDB');
    return connection;
  } catch (error) {
    console.error('Could not connect to RethinkDB:', error);
    throw error;
  }
};

// Route to handle form submission
app.post('/save', async (req, res) => {
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
        // Redirect back to index.html after saving
        res.redirect('/');
      });
    });
  } catch (err) {
    console.error('Error creating square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const startServer = async () => {
  try {
    await connectToRethinkDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
module.exports = { connectToRethinkDB };