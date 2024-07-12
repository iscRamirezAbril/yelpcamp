// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
// |----------------| Require Libraries |----------------| //

// |----------------| Campground Schema |----------------| //
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
// |----------------| Campground Schema |----------------| //

// === Campground Middleware Remove function === //
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

// === Campground Schema Export === //
module.exports = mongoose.model('Campground', CampgroundSchema);