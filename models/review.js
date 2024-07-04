// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// |----------------| Require Libraries |----------------| //

// |------------------| Review Schema |------------------| //
const reviewSchema = new Schema({
    body: String,
    rating: Number
});
// |------------------| Review Schema |------------------| //

// === Campground Schema Export === //
module.exports = mongoose.model("Review", reviewSchema);