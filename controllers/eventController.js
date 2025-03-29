const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    let events;
    if(req.user && req.user.role === 'organizer') {
      events = await Event.find({ organizerId: req.user._id });
    } else {
      events = await Event.find();
    }
    res.render('events/list', { events });
  } catch(err) {
    console.error(err);
    res.send('Error retrieving events');
  }
};

exports.getCreateEvent = (req, res) => {
  res.render('events/create');
};

exports.postCreateEvent = async (req, res) => {
  try {
    const { title, description, date, location, dressCode, theme } = req.body;
    const event = new Event({
      organizerId: req.user._id,
      title,
      description,
      date,
      location,
      dressCode,
      theme
    });
    await event.save();
    req.flash('success_msg', 'Event created successfully');
    res.redirect('/events');
  } catch(err) {
    console.error(err);
    res.send('Error creating event');
  }
};

exports.getEditEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if(!event) {
      req.flash('error_msg', 'Event not found');
      return res.redirect('/events');
    }
    res.render('events/edit', { event });
  } catch(err) {
    console.error(err);
    res.send('Error retrieving event');
  }
};

exports.postEditEvent = async (req, res) => {
  try {
    const { title, description, date, location, dressCode, theme } = req.body;
    await Event.findByIdAndUpdate(req.params.id, {
      title,
      description,
      date,
      location,
      dressCode,
      theme
    });
    req.flash('success_msg', 'Event updated successfully');
    res.redirect('/events');
  } catch(err) {
    console.error(err);
    res.send('Error updating event');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Event deleted successfully');
    res.redirect('/events');
  } catch(err) {
    console.error(err);
    res.send('Error deleting event');
  }
};
