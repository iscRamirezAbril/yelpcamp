// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
// |----------------| Require Libraries |----------------| //

// |-------------------| Image Schema |------------------| //
const ImageSchema = new Schema ({
    url: String,
    filename: String
});
// |-------------------| Image Schema |------------------| //

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_250');
});

// |----------------| Campground Schema |----------------| //
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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