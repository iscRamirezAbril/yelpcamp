// |----------------| Required Libraries |---------------| //
const { campgroundSchema, reviewSchema } = require('./schemas');
// |----------------| Required Libraries |---------------| //

// |----------------| Middleware functions |----------------| //
    // === Middleware Logged In function === //
    module.exports.isLoggedIn = (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl; // add this line
            req.flash('error', 'You must be logged in!');
            return res.redirect('/login');
        }
        next();
    }

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

    // === Middleware Return Session function === //
    module.exports.storeReturnTo = (req, res, next) => {
        if (req.session.returnTo) {
            res.locals.returnTo = req.session.returnTo;
        }
        next();
    }
// |----------------| Middleware functions |----------------| //