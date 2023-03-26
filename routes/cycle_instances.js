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
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(CycleInstance, {
      path: "cycle",
      select: "name slug",
    }),
    getCycleInstances
  )
  .post(protect, authorize("admin"), addCycleInstance);

router
  .route("/:id")
  .get(getCycleInstance)
  .put(protect, authorize("admin"), updateCycleInstance)
  .delete(protect, authorize("admin"), deleteCycleInstance);

module.exports = router;
