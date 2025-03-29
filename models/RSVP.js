const mongoose = require('mongoose');

const RSVPSchema = new mongoose.Schema({
  invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', required: true },
  response:     { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  plusOnes:     { type: Number, default: 0 },
  mealPreference:{ type: String },
  comments:     { type: String },
  timestamp:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('RSVP', RSVPSchema);
