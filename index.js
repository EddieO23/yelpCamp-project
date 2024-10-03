const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
// const { required } = require("joi");

const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

//middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'))


app.use("/campgrounds", campgrounds);
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res) => {
  res.render('home')
});

// 404 Route

app.all("*", (req, res, next) => {
  next(new ExpressError("Page does not exist.", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong..." } = err;
  if (!err.message) {
    err.message = "Oh not. Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
