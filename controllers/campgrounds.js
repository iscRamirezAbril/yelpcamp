// |-----------------| Required Models |-----------------| //
const Campground = require('../models/campground');
// |-----------------| Required Models |-----------------| //

// === Campgrounds List Page === //
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

// === Register Render Campground Page === //
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

// === Register Campground Function === //
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'The campground was registered successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
};

// === Campground Details Page === //
module.exports.showCampground = async (req, res) => {
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
};

// === Campground Render Edit Page === //
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The campground was not found!');
        return res.redirect('/campgrounds');
    };
    res.render('campgrounds/edit', { campground });
};

// === Campground Update Page === //
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'The campground was updated successfully!');
    res.redirect(`/campgrounds/${campground._id}`);
};

// === Campground Delete Page === //
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};