const express = require("express");
const { getCycles, createCycle } = require("../controllers/cycles");
const router = express.Router();
// const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// // Re-route into other resource routers
// router.use('/:cycleId/transactions', transactionRouter);

router.route("/").get(getCycles).post(createCycle);
// .route('/')
// .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
// .post(protect, authorize('publisher', 'admin'), createBootcamp);

// router
//   .route('/:id')
//   .get(getcycle)
//   .put(protect, authorize('publisher', 'admin'), updateBootcamp)
//   .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
