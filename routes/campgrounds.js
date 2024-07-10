// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas');
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
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

    // |----------------| Middleware functions |----------------| //
    // === Middleware Campground function === //
    const validateCampground = (req, res, next) => {
        const { error } = campgroundSchema.validate(req.body);
        if(error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    };
    // |----------------| Middleware functions |----------------| //

// === Campgrounds List Page (POST) === //
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'The campground was registered successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Campground Details Page === //
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// === Campground Edit Page (GET) === //
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

// === Campground Edit Page (PUT) === //
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'The campground was updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Delete Campground === //
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router; // === Exporting routes from this file === //