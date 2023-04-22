const express = require('express');
const { getTransactionsOverview, getTargetsOverview, getMonthlySummaryOverview, getTrends, getPerformanceOverview } = require('../controllers/overview');

const Transaction = require('../models/Transaction');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { getTransactions } = require('../controllers/transactions');
const Target = require('../models/Target');
const CycleInstance = require('../models/CycleInstance');
const { getUsers } = require('../controllers/users');
const User = require('../models/User');

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


router
  .route("/performance")
  .get(
    // advancedResults(User, "targets transactions"),
    advancedResults(User, [{
      path: "targets",
      select: "category amount transactionDate",
    }, {
      path: "transactions",
      select: "category amount cycle",
    }]),
    getPerformanceOverview
  );



module.exports = router;
