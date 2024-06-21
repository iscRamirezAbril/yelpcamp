const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Campground Schema
const campgroundSchema = new Schema({
    ttle: String,
    price: String,
    description: String,
    location: String
});

// Exporting the Campground Schema
module.exports = mongoose.model('Campground', campgroundSchema);