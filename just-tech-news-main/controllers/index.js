// An index file to gather the routes to export to the server

// Dependencies
// Server connection
const router = require('express').Router();
// API routes folder
const apiRoutes = require('./api');
// The handlebars homepage and single page routes
const homeRoutes = require('./home-routes.js');
// The handlebars dashboard routes
const dashboardRoutes = require('./dashboard-routes.js');

// Define paths for the handlebars html routes
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// Define the path for the server for the API routes
router.use('/api', apiRoutes);

// Define a catch-all route for any resource that doesn't exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;