const router = require('express').Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../../models/User');

require('dotenv').config();

// @route POST api/auth/register
// @desc Register new user
// @access Public

router.post("/register", (req, res) => {
  if (!req.body.username || !req.body.username.trim()) {
    return res.status(400).json({ username: "Username cannot be blank" });
  }
  if (!req.body.password || !req.body.password.trim()) {
    return res.status(400).json({ password: "Password cannot be blank" });
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ username: "Username already exists" });
    } else {
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password.trim(), salt, (err, hash) => {
          if (err) throw err;
          const newUser = new User({
            username: req.body.username.trim(),
            password: hash
          });
          newUser.save()
            .then(() => res.sendStatus(201))
            .catch(err => res.status(400).json(err))
        });
      });
    }
  })
    .catch(err => res.status(400).json(err));
});

// @route POST api/auth/login
// @desc Login user
// @access Public

router.post("/login", (req, res) => {
  if (!req.body.username || !req.body.username.trim() || !req.body.password || !req.body.password.trim()) {
    return res.status(400).json({ error: "Incorrect username or password" });
  }
  User.findOne({ username: req.body.username }).then(user => {
    if (!user) {
      return res.status(400).json({ error: "Incorrect username or password" });
    }

    // Check password
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          username: user.username
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          {expiresIn: 31556926}, // 1 year in seconds
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ error: "Incorrect username or password" });
      }
    });
  })
    .catch(err => res.status(400).json(err));
});

module.exports = router;