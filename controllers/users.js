// |-----------------| Required Models |-----------------| //
const User = require('../models/user');
// |-----------------| Required Models |-----------------| //

// === Render register user page (GET) === //
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

// === Register user page (POST) === //
module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) return next();
            req.flash('success', 'Welcome to Yelpcamp!');
            res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

// === Render login user page (GET) === //
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

// === Login user page (POST) === //
module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

// === Logout user page === //
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};