const app = require('./app');
const sequelize = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const router = require('./routes/recipeRoutes.js')
// Start the server after ensuring database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    app.use("/recipes", router)

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
