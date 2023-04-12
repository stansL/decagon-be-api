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
// @desc      Get transactions Overview
// @route     GET /api/v1/overview/monthlySummary
// @access    Public
exports.getMonthlySummaryOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let output = results.data.map(result => {
    let map = new Map();
    result.transactions.forEach(element => {
      let key = element.category;
      let currentValue = map.get(key);
      if (currentValue) {
        map.set(key, currentValue + element.amount);
      } else {
        map.set(key, element.amount)
      }
    });
    return Object.fromEntries(map)
  });

  var monthlies = {
    amount: output[0].Monthlies,
    diff: (output[0].Monthlies - output[1].Monthlies),
    perc: ((output[0].Monthlies - output[1].Monthlies) / output[0].Monthlies * 100)
  }

  var fines = {
    amount: output[0].Fines,
    diff: (output[0].Fines - output[1].Fines),
    perc: ((output[0].Fines - output[1].Fines) / output[0].Fines * 100)
  }

  console.log(monthlies, fines)
  res.status(200).json(output);
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
