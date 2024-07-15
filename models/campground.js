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

const opts = { toJSON: { virtuals: true } };

// |----------------| Campground Schema |----------------| //
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opts);
// |----------------| Campground Schema |----------------| //

// === Campground Cluster Map PopUp properties function === //
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong> <p>${this.location.substring(0, 20)}...</p>`
});

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