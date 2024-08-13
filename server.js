const express = require("express");
const path = require("path");
const rethinkdbdash = require("rethinkdbdash");

const app = express();
const port = process.env.PORT || 3001;

// Connect to RethinkDB
const connectToRethinkDB = async () => {
  const r = rethinkdbdash({
    host: process.env.RETHINKDB_HOST || "localhost",
    port: process.env.RETHINKDB_PORT || 28015,
    db: process.env.RETHINKDB_NAME || "test"
  });
  try {
    await r.dbList();
    console.log("Connected to RethinkDB");
  } catch (error) {
    console.error("Failed to connect to RethinkDB:", error);
    throw error;
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const startServer = async () => {
  try {
    await connectToRethinkDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();