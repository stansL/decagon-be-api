const express = require("express");
const { getCycleInstances } = require("../controllers/cycle_instance");
const CycleInstance = require("../models/CycleInstance");
const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require('../middleware/auth');

router.route("/").get(
  advancedResults(CycleInstance, {
    path: "cycle",
    select: "name slug",
  }),
  getCycleInstances
);
// .post(protect, authorize('publisher', 'admin'), addCourse)

// router
//   .route('/:id')
//   .get(getCourse)
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
