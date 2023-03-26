const express = require("express");
const {
  getCycleInstances,
  getCycleInstance,
  addCycleInstance,
} = require("../controllers/cycle_instance");
const CycleInstance = require("../models/CycleInstance");
const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require('../middleware/auth');

router
  .route("/")
  .get(
    advancedResults(CycleInstance, {
      path: "cycle",
      select: "name slug",
    }),
    getCycleInstances
  )
  .post(addCycleInstance);
// .post(protect, authorize("publisher", "admin"), addCourse);

router.route("/:id").get(getCycleInstance);
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router;
