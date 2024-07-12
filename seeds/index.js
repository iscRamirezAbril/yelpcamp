// |----------------| Require Libraries |----------------| //
const mongoose = require('mongoose');
const cities = require('./cities');
const axios = require('axios');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
// |----------------| Require Libraries |----------------| //

// |---------------| Mongo DB connection |---------------| //
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
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

  // call unsplash and return small image
  async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'Z9CFLRUM2DwiwNpmVA2StLgyah-_A56n1sxizTYowRo',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
          author: '668ffdc549d6e70dfe7136af',
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          image: await seedImg(),
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa fugiat officiis quibusdam voluptates mollitia voluptatem eveniet laudantium exercitationem consequuntur, ducimus quod dolorem vero aspernatur repellat, beatae nesciunt minus recusandae deserunt.',
          price
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