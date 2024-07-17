// |-----------------| Required Modules |---------------| //
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
// |-----------------| Required Mondules |---------------| //

// |------------------| Required Routes |----------------| //
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
// |------------------| Required Routes |----------------| //

// |---------------| Mongo DB connection |---------------| //
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open" , () => {
    console.log("Database connected!");
});
// |---------------| Mongo DB connection |---------------| //

// Express Call
const app = express();

// |---------------| Directories & Engines |--------------| //
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// |---------------| Directories & Engines |--------------| //

// |------------------| Uses for the app |----------------| //
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize);
// |------------------| Uses for the app |----------------| //

// |--------------| Sessions Configurations |-------------| //
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // The session cookie "active time" is of "ONE WEEK"
        maxAge: 1000 * 60 * 60 * 24 * 7 // The max time that the cookie is going to be "active" is for "ONE WEEK"
    }
};
app.use(session(sessionConfig));
app.use(flash());
// |--------------| Sessions Configurations |--------------| //

// |---------------| Passport Configurations |-------------| //
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// |--------------| Passport Configurations |--------------| //

    // |----------------| Middleware functions |----------------| //
        // === Flash Middleware function === //
        app.use((req, res, next) => {
            res.locals.currentUser = req.user;
            res.locals.success = req.flash('success');
            res.locals.error = req.flash('error');
            next();
        });
    // |----------------| Middleware functions |----------------| //

// |------------------| Website Routes |------------------| //
// === Campgrounds Routes === //
app.use('/campgrounds', campgroundsRoutes);

// === Reviews Routes === //
app.use('/campgrounds/:id/reviews', reviewsRoutes);

// === Users Routes === //
app.use('/', userRoutes);

// === Home Page === //
app.get('/', (req, res) => {
    res.render('home');
});

// === 404 Page === //
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

// === Error Handler === //
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});
// |------------------| Website Routes |------------------| //

// Website Port
app.listen(3000, () => {
    console.log('Serving on port 3000');
});