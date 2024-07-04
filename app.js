// |----------------| Require Libraries |----------------| //
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas');
const path = require('path');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
// |----------------| Require Libraries |----------------|//

// Require Models
const Campground = require('./models/campground');
const Review = require('./models/review');

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
// === Home Page === //
app.get('/', (req, res) => {
    res.render('home');
});

// === Campgrounds List Page (GET) === //
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// === Register Campground Page === //
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// === Middleware function === //
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// === Campgrounds List Page (POST) === //
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Campground Details Page === //
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));

// === Campground Edit Page (GET) === //
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

// === Campground Edit Page (PUT) === //
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Delete Campground === //
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

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