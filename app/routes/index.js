/*
  Defines the routes for the root path '/'.
  Redirects to Shelter NS homepage.
*/
const express = require('express');
const router = express.Router();

// Define route for GET request to '/'
router.get('/', (req, res, next) => {
    // Redirect to https://www.shelternovascotia.com/
    res.redirect('https://www.shelternovascotia.com/');
});

module.exports = router;