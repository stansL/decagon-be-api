const express = require('express');
const { getTransactionsOverview, getTargetsOverview, getMonthlySummaryOverview, getTrends } = require('../controllers/overview');

const Transaction = require('../models/Transaction');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { getTransactions } = require('../controllers/transactions');
const Target = require('../models/Target');
const CycleInstance = require('../models/CycleInstance');

router
  .route('/transactions')
  .get(advancedResults(Transaction), getTransactionsOverview);

router
  .route('/targets')
  .get(advancedResults(Target), getTargetsOverview);

router
  .route('/monthlySummary')
  .get(advancedResults(CycleInstance, [{
    path: "cycle",
    select: "name slug",
  }, {
    path: "transactions",
    select: "category amount",
  }]), getMonthlySummaryOverview);

router
  .route("/trends")
  .get(
    advancedResults(CycleInstance, [{
      path: "cycle",
      select: "name slug targets",
    }, {
      path: "transactions",
      select: "category amount",
    }]),
    getTrends
  );


module.exports = router;
