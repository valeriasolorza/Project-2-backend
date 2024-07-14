const app = require('./app'); // Import the app module
const { connectDB } = require('./db'); // Ensure this path is correct
const PORT = process.env.PORT || 5000;

// Connect to the database (if needed)
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
