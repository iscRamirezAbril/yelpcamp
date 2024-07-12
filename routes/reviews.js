// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');
// |---------------| Required Libraries |----------------| //

// |-----------------| Required Models |-----------------| //
const Campground = require('../models/campground');
const Review = require('../models/review');
// |-----------------| Required Models |-----------------| //

// === Reviews List / Create for Campgrounds === //
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// === Delete Review === //
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router; // === Exporting routes from this file === //