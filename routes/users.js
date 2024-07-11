// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
// |---------------| Required Libraries |----------------| //

// |-----------------| Required Models |-----------------| //
const User = require('../models/user');
// |-----------------| Required Models |-----------------| //

// === Register user page (GET) === //
router.get('/register', (req, res) => {
    res.render('users/register');
});

// === Register user page (POST) === //
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelpcamp!');
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

// === Login user page (GET) === //
router.get('/login', (req, res) => {
    res.render('users/login');
});

// === Login user page (POST) === //
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }) , async (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
});

module.exports = router; // === Exporting routes from this file === //