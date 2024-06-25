// |----------------| Require Libraries |----------------| //
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
// |----------------| Require Libraries |----------------|//

// Require Models
const Campground = require('./models/campground');

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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// === Register Campground Page === //
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// === Campgrounds List Page (POST) === //
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// === Campground Details Page === //
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
});

// === Campground Edit Page (GET) === //
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
});

// === Campground Edit Page (PUT) === //
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

// === Delete Campground === //
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});
// |------------------| Website Routes |------------------| //

// Website Port
app.listen(3000, () => {
    console.log('Serving on port 3000');
});