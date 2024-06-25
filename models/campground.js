// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// |----------------| Require Libraries |----------------| //

// |----------------| Campground Schema |----------------| //
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});
// |----------------| Campground Schema |----------------| //

// === Campground Schema Export === //
module.exports = mongoose.model('Campground', CampgroundSchema);