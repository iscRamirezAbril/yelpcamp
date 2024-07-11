// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router();
// |---------------| Required Libraries |----------------| //

// |-----------------| Required Models |-----------------| //
const User = require('../models/user');
// |-----------------| Required Models |-----------------| //

// === Register user page (GET) === //
router.get('/register', (req, res) => {
    res.render('users/register');
});

// === Register user page (POST) === //
router.post('/register', async (req, res) => {
    res.send(req.body);
});

module.exports = router; // === Exporting routes from this file === //