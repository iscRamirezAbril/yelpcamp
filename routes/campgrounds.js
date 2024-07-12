// |---------------| Required Libraries |----------------| //
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
// |---------------| Required Libraries |----------------| //

// === Campgrounds "/" routes === //
router.route('/')
    .get(catchAsync(campgrounds.index)) // === Campgrounds List Page (GET) === //
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) // === Campgrounds List / Register Page (POST) === //

router.get('/new', isLoggedIn, campgrounds.renderNewForm); // === Register Campground Page === //

// === Campgrounds "/:id" routes === //
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) // === Campground Details Page === //
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) // === Campground Edit Page (PUT) === //
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // === Delete Campground === //

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); // === Campground Edit Page (GET) === //

module.exports = router; // === Exporting routes from this file === //