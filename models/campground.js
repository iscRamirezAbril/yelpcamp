// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// |----------------| Require Libraries |----------------| //

// |----------------| Campground Schema |----------------| //
const CampgroundSchema = new Schema({
    title: {
        type: String,
        require: true
    },

    image: {
        type: String,
        require: true
    },

    price: {
        type: Number,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    location: {
        type: String,
        require: true
    }
});
// |----------------| Campground Schema |----------------| //

// === Campground Schema Export === //
module.exports = mongoose.model('Campground', CampgroundSchema);