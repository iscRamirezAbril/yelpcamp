// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateReview } = require('../middleware');
// |---------------| Required Libraries |----------------| //

// |-----------------| Required Models |-----------------| //
const Campground = require('../models/campground');
const Review = require('../models/review');
// |-----------------| Required Models |-----------------| //

// === Reviews List for Campgrounds === //
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review published!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// === Delete Review === //
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router; // === Exporting routes from this file === //