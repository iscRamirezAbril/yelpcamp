// |-----------------| Required Libraries |-----------------| //
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
// |-----------------| Required Libraries |-----------------| //

// |------------------| Required Models |-------------------| //
const Campground = require('./models/campground');
const Review = require('./models/review');
// |------------------| Required Models |-------------------| //

// |----------------| Middleware functions |----------------| //
    // === Middleware Logged In function === //
    module.exports.isLoggedIn = (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl; // add this line
            req.flash('error', 'You must be logged in!');
            return res.redirect('/login');
        }
        next();
    };

    // === Middleware Review function === //
    module.exports.validateReview = (req, res, next) => {
        const { error } = reviewSchema.validate(req.body);
        if(error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    };

    // === Middleware Campground function === //
    module.exports.validateCampground = (req, res, next) => {
        const { error } = campgroundSchema.validate(req.body);
        console.log(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
    };

    // === Middleware Return Session function === //
    module.exports.storeReturnTo = (req, res, next) => {
        if (req.session.returnTo) {
            res.locals.returnTo = req.session.returnTo;
        }
        next();
    };

    // === Middleware "is Author?" campground function === //
    module.exports.isAuthor = async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user._id)) {
            req.flash('error', 'You dont have permission to do that!');
            return res.redirect(`/campgrounds/${id}`);
        } else {
            next();
        }
    };

    // === Middleware "is Author?" review function === //
    module.exports.isReviewAuthor = async (req, res, next) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.author.equals(req.user._id)) {
            req.flash('error', 'You dont have permission to do that!');
            return res.redirect(`/campgrounds/${id}`);
        } else {
            next();
        }
    };
// |----------------| Middleware functions |----------------| //