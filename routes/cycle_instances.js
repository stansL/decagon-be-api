const express = require("express");
const {
  getCycleInstances,
  getCycleInstance,
  addCycleInstance,
  updateCycleInstance,
  deleteCycleInstance,
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
// .post(protect, authorize("publisher", "admin"), addCycleInstance);

router
  .route("/:id")
  .get(getCycleInstance)
  .put(updateCycleInstance)
  //   .put(protect, authorize('publisher', 'admin'), updateCycleInstance)
  .delete(deleteCycleInstance);
//   .delete(protect, authorize('publisher', 'admin'), deledeleteCycleInstancete)

module.exports = router;
