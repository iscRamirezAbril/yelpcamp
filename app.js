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
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;
// |-----------------| Required Mondules |---------------| //

// |------------------| Required Routes |----------------| //
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const { func } = require('joi');
// |------------------| Required Routes |----------------| //

// === Local Database === //
/* mongodb://localhost:27017/yelp-camp */

// const dbUrl = 'mongodb://localhost:27017/yelp-camp';

// |---------------| Mongo DB connection |---------------| //
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open" , () => {
    console.log("Database connected!");
});
// |---------------| Mongo DB connection |---------------| //

// === Express Call === //
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
app.use(mongoSanitize({
    replaceWith: '_'
}));

app.use(helmet());
// |------------------| Uses for the app |----------------| //

// |-------------------| Securiry Policy |----------------| //
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dkpjoasyn/",
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
        	    "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// |-------------------| Securiry Policy |----------------| //

// |--------------| Sessions Configurations |-------------| //
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
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