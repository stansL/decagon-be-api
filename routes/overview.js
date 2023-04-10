const express = require('express');
const { getTransactionsOverview, getTargetsOverview } = require('../controllers/overview');

const Transaction = require('../models/Transaction');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { getTransactions } = require('../controllers/transactions');
const Target = require('../models/Target');

router
  .route('/transactions')
  .get(advancedResults(Transaction), getTransactionsOverview);

router
  .route('/targets')
  .get(advancedResults(Target), getTargetsOverview);


module.exports = router;
