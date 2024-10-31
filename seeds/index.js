const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '671816536684cac13acfdd33',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis distinctio error ipsam doloremque molestiae commodi cum neque dicta provident unde voluptate suscipit nisi, voluptas officia. Amet iste ex quae minus.",
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dbsmctgow/image/upload/v1730393634/YelpCamp/wkobldz1iuifiqxytneu.png',
          filename: 'YelpCamp/wkobldz1iuifiqxytneu',
        },
        {
          url: 'https://res.cloudinary.com/dbsmctgow/image/upload/v1730393634/YelpCamp/lwysdideoqyubjrvmsoy.png',
          filename: 'YelpCamp/lwysdideoqyubjrvmsoy',
        },
        {
          url: 'https://res.cloudinary.com/dbsmctgow/image/upload/v1730393634/YelpCamp/c2sgijudtishmy27cgj3.png',
          filename: 'YelpCamp/c2sgijudtishmy27cgj3',
        }
      ]
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
