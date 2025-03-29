const Invitation = require('../models/Invitation');
const Event = require('../models/Event');
const csv = require('csv-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

// invitationController.js
exports.getGuestInvitations = async (req, res) => {
    try {
      const invitations = await Invitation.find({ guestEmail: req.user.email })
        .populate('eventId'); // Must match your ref in the schema
      
      res.render('invitations/guest', { invitations, user: req.user });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error retrieving invitations');
      res.redirect('/');
    }
  };
  


exports.getInvitations = async (req, res) => {
  try {
    let invitations;
    if(req.user.role === 'organizer') {
      const events = await Event.find({ organizerId: req.user._id });
      const eventIds = events.map(e => e._id);
      invitations = await Invitation.find({ eventId: { $in: eventIds } });
    } else {
      invitations = await Invitation.find();
    }
    res.render('invitations/track', { invitations });
  } catch(err) {
    console.error(err);
    res.send('Error retrieving invitations');
  }
};

exports.getSendInvitation = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id });
    res.render('invitations/send', { events });
  } catch(err) {
    console.error(err);
    res.send('Error retrieving events for invitation');
  }
};

exports.postSendInvitation = async (req, res) => {
  try {
    const { eventId, guestEmail, customMessage } = req.body;
    const invitationLink = `http://localhost:3000/invitations/respond/${eventId}`; // Simplified invitation link
    const invitation = new Invitation({
      eventId,
      guestEmail,
      invitationLink,
      customMessage,
      status: 'sent'
    });
    await invitation.save();
    
    // Send email using nodemailer (Gmail example)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: guestEmail,
      subject: 'Event Invitation',
      text: `You are invited to the event. ${customMessage} \nPlease RSVP here: ${invitationLink}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
    req.flash('success_msg', 'Invitation sent successfully');
    res.redirect('/invitations');
  } catch(err) {
    console.error(err);
    res.send('Error sending invitation');
  }
};

exports.bulkUploadInvitations = (req, res) => {
  if(!req.file) {
    req.flash('error_msg', 'Please upload a CSV file');
    return res.redirect('/invitations/send');
  }

  exports.getSendInvitation = async (req, res) => {
    try {
      const events = await Event.find({ organizerId: req.user._id });
      const guests = await User.find({ role: 'guest' });
      // Pass the query parameter if available
      const queryEventId = req.query.eventId || '';
      res.render('invitations/send', { events, guests, queryEventId });
    } catch(err) {
      console.error(err);
      req.flash('error_msg', 'Error retrieving data');
      res.redirect('/dashboard');
    }
  };
  
  
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for(let row of results) {
        const invitation = new Invitation({
          eventId: row.eventId,
          guestEmail: row.guestEmail,
          invitationLink: `http://localhost:3000/invitations/respond/${row.eventId}`,
          customMessage: row.customMessage || '',
          status: 'sent'
        });
        await invitation.save();
      }
      req.flash('success_msg', 'Bulk invitations uploaded successfully');
      res.redirect('/invitations');
    });
};
