const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/auth/login');
}
function ensureOrganizer(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'organizer' || req.user.role === 'admin')) {
      return next();
    }
    req.flash('error_msg', 'You are not authorized to create events.');
    res.redirect('/');
  }
  

// Event routes
router.get('/', ensureAuthenticated, eventController.getEvents);
router.get('/create', ensureAuthenticated, eventController.getCreateEvent);
router.post('/create', ensureAuthenticated, eventController.postCreateEvent);
router.get('/edit/:id', ensureAuthenticated, eventController.getEditEvent);
router.post('/edit/:id', ensureAuthenticated, eventController.postEditEvent);
router.post('/delete/:id', ensureAuthenticated, eventController.deleteEvent);
// routes/eventRoutes.js
router.get('/create', ensureOrganizer, eventController.getCreateEvent);
router.post('/create', ensureOrganizer, eventController.postCreateEvent);


module.exports = router;
