const app = require('./app'); // Import the app module
const { connectDB } = require('./config/db'); // Update the path to point to the config folder
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to the database (if needed)
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
