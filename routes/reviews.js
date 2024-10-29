const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require('../controllers/reviews')

// middleware
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview)
);
router.post(
  "/:id/reviews/:reviewId",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// router.delete(
//   "/:id",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect("/campgrounds");
//   })
// );

router.delete(
  "/:reviewId", 
  isLoggedIn, 
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
