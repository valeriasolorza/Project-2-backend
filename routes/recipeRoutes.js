const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint to fetch a random meal
router.get('/random-meal', async (req, res) => {
  try {
    // Make a request to TheMealDB API for a random meal
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    
    // Send the API response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error('Error fetching random meal:', error.message);
    res.status(500).json({ error: 'Failed to fetch random meal' });
  }
});

// Endpoint to search for meals by ingredient
router.get('/search-by-ingredient', async (req, res) => {
  const ingredient = req.query.i; // Get ingredient from query parameter

  if (!ingredient) {
    return res.status(400).json({ error: 'Ingredient query parameter is required' });
  }

  try {
    // Make a request to TheMealDB API to search for meals by ingredient
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php', {
      params: { i: ingredient }
    });

    // Send the API response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error('Error searching meals by ingredient:', error.message);
    res.status(500).json({ error: 'Failed to search meals by ingredient' });
  }
});

module.exports = router;
