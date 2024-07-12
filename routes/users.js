// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');
// |---------------| Required Libraries |----------------| //

// === Users "/register" routes === //
router.route('/register')
    .get(users.renderRegister) // === Register user page (GET) === //
    .post(catchAsync(users.registerUser)) // === Register user page (POST) === //

// === Users "/login" routes === //
router.route('/login')
    .get(users.renderLogin) // === Login user page (GET) === //
    .post( storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser) // === Login user page (POST) === //

router.get('/logout', users.logoutUser); // === Logout user page === //

// === Exporting routes from this file === //
module.exports = router;