const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};


router.get(
  "/",
  catchAsync(async (require, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'succesfully made a new campground' )
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    console.log(campground);
    res.render("campgrounds/show", { campground });
  })
);

// router.get(
//   "/:id",
//   catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate(
//       "reviews"
//     );
//     if(!campground) {
//       req.flash('error', 'Cannot find that campground')
//       return res.redirect('/campgrounds')
//     }
//     res.render("campgrounds/show", { campground });
//   })
// );


router.get('/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}))
// Update campground route


// router.get(
//   "/:id/edit",
//   catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     res.render("campgrounds/edit", { campground });
//   })
// );

router.get('/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground });
}))

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Succesfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete('/:id', catchAsync(async(req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Succesfully deleted campground');
  res.redirect('/campgrounds')
}))


module.exports = router