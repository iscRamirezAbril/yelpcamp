// |----------------| Required Libraries |---------------| //
const { campgroundSchema, reviewSchema } = require('./schemas');
// |----------------| Required Libraries |---------------| //

// |----------------| Middleware functions |----------------| //
    // === Middleware Logged In function === //
    module.exports.isLoggedIn = (req, res, next) => {
        if(!req.isAuthenticated()) {
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
        if(error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    };
// |----------------| Middleware functions |----------------| //