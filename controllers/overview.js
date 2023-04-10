const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Transaction = require('../models/Transaction');
const CycleInstance = require('../models/CycleInstance');

// @desc      Get transactions Overview
// @route     GET /api/v1/overview/transactions
// @access    Public
exports.getTransactionsOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let map = new Map();
  results.data.forEach(element => {
    let key = element.category;
    let currentValue = map.get(key);
    if (currentValue) {
      map.set(key, currentValue + element.amount);
    } else {
      map.set(key, element.amount)
    }
  });

  res.status(200).json(Object.fromEntries(map));

});

// @desc      Get Targets Overview
// @route     GET /api/v1/overview/targets
// @access    Public
exports.getTargetsOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let map = new Map();
  results.data.forEach(element => {
    let key = element.category;
    let currentValue = map.get(key);
    if (currentValue) {
      map.set(key, currentValue + element.amount);
    } else {
      map.set(key, element.amount)
    }
  });

  res.status(200).json(Object.fromEntries(map));

});
