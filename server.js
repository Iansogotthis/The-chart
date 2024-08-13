const express = require('express');
const { connectToRethinkDB } = require('./db'); // Ensure correct import

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const startServer = async () => {
  try {
    await connectToRethinkDB(); // Ensure correct function call
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();