const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview} = require('../middleware')
const Campground = require("../models/campground");
const Review = require("../models/review");

// middleware
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");


router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${campground._id}`);
  })
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
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You deleted a review')
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
