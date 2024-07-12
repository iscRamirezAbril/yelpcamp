// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
// |---------------| Required Libraries |----------------| //

// |-----------------| Required Models |-----------------| //
const Campground = require('../models/campground');
// |-----------------| Required Models |-----------------| //

// === Campgrounds List Page (GET) === //
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// === Register Campground Page === //
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// === Campgrounds List Page (POST) === //
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'The campground was registered successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Campground Details Page === //
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'The campground was not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// === Campground Edit Page (GET) === //
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The campground was not found!');
        return res.redirect('/campgrounds');
    };
    res.render('campgrounds/edit', { campground });
}));

// === Campground Edit Page (PUT) === //
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'The campground was updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Delete Campground === //
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router; // === Exporting routes from this file === //