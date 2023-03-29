const express = require("express");
const {
  getCycles,
  createCycle,
  getCycle,
  updateCycle,
  deleteCycle,
} = require("../controllers/cycles");

// Include other resource routers
const cycleInstanceRouter = require("./cycle_instances");
const targetRouter = require("./targets");
// const reviewRouter = require('./reviews');

const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const Cycle = require("../models/Cycle");

// Re-route into other resource routers
router.use("/:cycleId/cycle_instances", cycleInstanceRouter);
router.use("/:cycleId/targets", targetRouter);

router
  .route("/")
  .get(advancedResults(Cycle, "cycle_instances"), getCycles) //fetches all the fields for the virtual
  // advancedResults(Cycle, { //case to limit the number of fields returned as part of the virtual
  //   path: "cycle_instances",
  //   select: "meetingDate meetingType",
  // }),
  .post(protect, authorize("admin"), createCycle);
router
  .route("/:id")
  .get(getCycle)
  .put(protect, authorize("admin"), updateCycle)
  .delete(protect, authorize("admin"), deleteCycle);
module.exports = router;
