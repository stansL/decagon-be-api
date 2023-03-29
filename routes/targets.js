const express = require("express");
const {
  getTargets,
  addTarget,
  getTarget,
  updateTarget,
  deleteTarget,
} = require("../controllers/targets");

const Target = require("../models/Target");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Target, {
      path: "cycle",
      select: "name slug",
    }),
    getTargets
  )
  .post(protect, authorize("admin", "finance"), addTarget);

router
  .route("/:id")
  .get(getTarget)
  .put(protect, authorize("finance", "admin"), updateTarget)
  .delete(protect, authorize("finance", "admin"), deleteTarget);

module.exports = router;
