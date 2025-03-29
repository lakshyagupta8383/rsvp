const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  eventId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  guestEmail:    { type: String, required: true },
  status:        { type: String, enum: ['pending', 'sent', 'delivered', 'bounced'], default: 'pending' },
  invitationLink:{ type: String },
  customMessage: { type: String },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invitation', InvitationSchema);
