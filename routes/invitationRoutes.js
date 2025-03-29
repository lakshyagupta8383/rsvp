const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/auth/login');
}
// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
  }
  
  // Existing routes...
  router.get('/guest', ensureAuthenticated, invitationController.getGuestInvitations);
  
  module.exports = router;
  
// Invitation routes
router.get('/', ensureAuthenticated, invitationController.getInvitations);
router.get('/send', ensureAuthenticated, invitationController.getSendInvitation);
router.post('/send', ensureAuthenticated, invitationController.postSendInvitation);
router.post('/bulk-upload', ensureAuthenticated, upload.single('csvFile'), invitationController.bulkUploadInvitations);

// RSVP response routes (simplified)
router.get('/respond/:eventId', (req, res) => {
  res.render('invitations/respond', { eventId: req.params.eventId });
});

router.post('/respond/:eventId', (req, res) => {
  // In a real app, you would process and save the RSVP response.
  // Emit a socket event for real-time update:
  req.app.get('io').emit('rsvpUpdate', { eventId: req.params.eventId, response: req.body.response });
  req.flash('success_msg', 'RSVP submitted successfully');
  res.redirect('/');
});

module.exports = router;
