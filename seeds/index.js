// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
// |----------------| Require Libraries |----------------| //

// |---------------| Mongo DB connection |---------------| //
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
// |---------------| Mongo DB connection |---------------| //

// |----------| Adding Campground to Mongo DB |----------| //
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
// |----------| Adding Campground to Mongo DB |----------| //

// |-----------| Closing Mongo DB Connection |-----------| //
seedDB().then(() => {
    mongoose.connection.close();
})
// |-----------| Closing Mongo DB Connection |-----------| //