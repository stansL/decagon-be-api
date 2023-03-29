const express = require('express');
const { getTransactions, addTransaction, updateTransaction, deleteTransaction, getTransaction } = require('../controllers/transactions');

const Transaction = require('../models/Transaction');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Transaction), getTransactions)
  .post(protect, authorize('finance', 'admin'), addTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(protect, authorize('finance', 'admin'), updateTransaction)
  .delete(protect, authorize('finance', 'admin'), deleteTransaction);

module.exports = router;
