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
// const reviewRouter = require('./reviews');

const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
// const { protect, authorize } = require('../middleware/auth');

const Cycle = require("../models/Cycle");

// Re-route into other resource routers
router.use("/:cycleId/cycle_instances", cycleInstanceRouter);

router
  // .route("/").get(getCycles).post(createCycle);
  .route("/")
  .get(advancedResults(Cycle, "cycle_instances"), getCycles) //fetches all the fields for the virtual
  // advancedResults(Cycle, { //case to limit the number of fields returned as part of the virtual
  //   path: "cycle_instances",
  //   select: "meetingDate meetingType",
  // }),
  // .post(protect, authorize('publisher', 'admin'), createCycle);
  .post(createCycle);

router
  .route("/:id")
  .get(getCycle)
  //   .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .put(updateCycle)
  //   .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)
  .delete(deleteCycle);
module.exports = router;
