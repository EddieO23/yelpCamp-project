const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const Campground = require("../models/campground");
// const campground = require('../models/campground');

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(upload.array('image') , (req, res) => {
    console.log(req.body, req.files);
    res.send('It worked!')
    // res.status(req.body).send(req.file)
  });
// .post(
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCampground)
// );

router.get("/");

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// router.post("/");

// refactoring the ID routes to just one route
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// router.get("/:id");
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
