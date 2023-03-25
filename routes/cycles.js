const express = require("express");
const {
  getCycles,
  createCycle,
  getCycle,
  updateCycle,
  deleteCycle,
} = require("../controllers/cycles");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const Cycle = require("../models/Cycle");
// const { protect, authorize } = require('../middleware/auth');

// // Re-route into other resource routers
// router.use('/:cycleId/transactions', transactionRouter);

router
  // .route("/").get(getCycles).post(createCycle);
  .route("/")
  // .get(advancedResults(Bootcamp, 'courses'), getCycles)
  .get(advancedResults(Cycle), getCycles);
// .post(protect, authorize('publisher', 'admin'), createCycle);

router
  .route("/:id")
  .get(getCycle)
  //   .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .put(updateCycle)
  //   .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)
  .delete(deleteCycle);
module.exports = router;
