const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  date:        { type: Date, required: true },
  location:    { type: String },
  dressCode:   { type: String },
  theme:       { type: String },
  multimedia:  [String], // Array to hold file paths or URLs
  createdAt:   { type: Date, default: Date.now },
  calendarSyncInfo: Object // For storing external calendar sync details
});

module.exports = mongoose.model('Event', EventSchema);
