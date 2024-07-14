// |----------------| Required Libraries |---------------| //
const { cloudinary } = require("../cloudinary");
// |----------------| Required Libraries |---------------| //

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
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
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
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        };
        await campground.updateOne( { $pull: { images: { filename: { $in: req.body.deleteImages } } } } );
    };
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