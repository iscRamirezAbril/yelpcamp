// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// |----------------| Require Libraries |----------------| //

// |------------------| Review Schema |------------------| //
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
// |------------------| Review Schema |------------------| //

// === Campground Schema Export === //
module.exports = mongoose.model("Review", reviewSchema);