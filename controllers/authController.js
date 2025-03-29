const User = require('../models/User');
const passport = require('passport');
exports.getRegister = (req, res) => {
    res.render('auth/register', { errors: [], role: 'guest', username: '', email: '' });
  };
  
exports.postRegister = async (req, res) => {
  const { username, email, password, password2, role } = req.body;
  let errors = [];
  if (errors.length > 0) {
    return res.render('auth/register', { errors, username, email, role });
  }
  
  if (errors.length > 0) {
    return res.render('auth/register', { errors, username, email, role });
  }  
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if(password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if(errors.length > 0) {
    res.render('auth/register', { errors, username, email, role });
  } else {
    try {
      let user = await User.findOne({ email });
      if(user) {
        errors.push({ msg: 'Email already registered' });
        res.render('auth/register', { errors, username, email, role });
      } else {
        user = new User({ username, email, password, role });
        await user.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
      }
    } catch(err) {
      console.error(err);
      res.render('auth/register', { errors: [{ msg: 'Something went wrong' }], username, email, role });
    }
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect('/auth/login'); // or flash an error message
      req.logIn(user, function(err) {
        if (err) return next(err);
        // Redirect based on user role
        if (user.role === 'guest') {
          return res.redirect('/invitations/guest');
        } else {
          return res.redirect('/events');
        }
      });
    })(req, res, next);
  };
  

exports.logout = (req, res, next) => {
    req.logout(function(err) {
      if (err) { 
        return next(err);
      }
      req.session.destroy(); // Clear session data
      req.flash('success_msg', 'You are logged out');
      res.redirect('/auth/login');
    });
  };
  