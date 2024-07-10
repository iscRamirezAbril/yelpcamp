// |----------------| Required Libraries |---------------| //
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
// |----------------| Required Libraries |---------------| //

// |---------------| Mongo DB connection |---------------| //
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewURLParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open" , () => {
    console.log("Database connected!");
});
// |---------------| Mongo DB connection |---------------| //

// Express Call
const app = express();

// |---------------| Directories & Engines|---------------| //
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// |-------------------| Directories |-------------------| //

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

// |------------------| Website Routes |------------------| //
// === Campgrounds Routes === //
app.use('/campgrounds', campgrounds);

// === Reviews Routes === //
app.use('/campgrounds/:id/reviews', reviews);

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