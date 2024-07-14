const express = require('express');
const { connectDB } = require('./db');
require('dotenv').config();

const app = express();

app.use(express.json());

// Connect to the database
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
