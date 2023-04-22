const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Transaction = require('../models/Transaction');
const CycleInstance = require('../models/CycleInstance');

// @desc      Get transactions Overview
// @route     GET /api/v1/overview/transactions
// @access    Public
exports.getTransactionsOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let map = new Map(Object.entries({
    Annual: 0,
    Monthly: 0,
    Registration: 0,
    Welfare: 0,
    Fine: 0
  }));
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



// @desc      Get trends Overview
// @route     GET /api/v1/overview/trends
// @access    Public
exports.getTrends = asyncHandler(async (req, res, next) => {
  let desiredYear = parseInt(req.query.cycleYear);
  let results;

  if (!desiredYear) {
    results = res.advancedResults;
  } else {
    let serverRes = await CycleInstance
      .find({
        meetingDate: {
          $gte: new Date(`${desiredYear}-01-01T00:00:00.000Z`), // January 1st of the desired year - midnight
          $lt: new Date(`${desiredYear + 1}-01-01T00:00:00.000Z`) // January 1st of the following year - midnight
        }
      })
      .populate('cycle transactions');
    results = {
      success: true,
      count: serverRes.length,
      data: serverRes
    }
  }

  let returnObject = {
    labels: [],
    self: [],
    averages: [],
    targets: [],
    fines: [],
  }

  results.data.forEach(element => {
    returnObject.labels.push(convertDate(element.meetingDate));
    returnObject.self.push(element.transactions.reduce((sum, current) => (sum + current.amount), 0));
    returnObject.averages.push(element.transactions.reduce((sum, current) => (sum + current.amount), 0) / 11);
    returnObject.targets.push(Object.values(element.cycle.targets).reduce((sum, current) => (sum + current), 0));
    returnObject.fines.push(element.transactions.filter(trans => trans.category === 'Fine').reduce((sum, current) => (sum + current.amount), 0));
  });



  // let output = results.data.map(result => {
  //   let map = new Map(Object.entries({
  //     Annual: 0,
  //     Monthly: 0,
  //     Registration: 0,
  //     Welfare: 0,
  //     Fine: 0
  //   }));
  //   result.transactions.forEach(element => {
  //     let key = element.category;
  //     let currentValue = map.get(key);
  //     if (currentValue) {
  //       map.set(key, currentValue + element.amount);
  //     } else {
  //       map.set(key, element.amount)
  //     }
  //   });
  //   return Object.fromEntries(map)
  // });

  // var monthlies = {
  //   amount: output[0].Monthly,
  //   diff: (output[0].Monthly - output[1].Monthly),
  //   perc: Math.abs((output[0].Monthly - output[1].Monthly) / output[0].Monthly * 100)
  // }

  // var fines = {
  //   amount: output[0].Fine,
  //   diff: (output[0].Fine - output[1].Fine),
  //   perc: Math.round(Math.abs((output[0].Fine - output[1].Fine) / output[0].Fine * 100))
  // }

  // res.status(200).json({ monthlies, fines });
  res.status(200).json(returnObject);
});


// @desc      Get transactions Overview
// @route     GET /api/v1/overview/monthlySummary
// @access    Public
exports.getMonthlySummaryOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let output = results.data.map(result => {
    let map = new Map(Object.entries({
      Annual: 0,
      Monthly: 0,
      Registration: 0,
      Welfare: 0,
      Fine: 0
    }));
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
    amount: output[0].Monthly,
    diff: (output[0].Monthly - output[1].Monthly),
    perc: Math.abs((output[0].Monthly - output[1].Monthly) / output[0].Monthly * 100)
  }

  var fines = {
    amount: output[0].Fine,
    diff: (output[0].Fine - output[1].Fine),
    perc: Math.round(Math.abs((output[0].Fine - output[1].Fine) / output[0].Fine * 100))
  }

  res.status(200).json({ monthlies, fines });
});




// @desc      Get Targets Overview
// @route     GET /api/v1/overview/targets
// @access    Public
exports.getTargetsOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let map = new Map(Object.entries({
    Annual: 0,
    Monthly: 0,
    Registration: 0,
    Welfare: 0,
    Fine: 0
  }));
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
exports.getPerformanceOverview = asyncHandler(async (req, res, next) => {
  let results = res.advancedResults;
  let data = results.data.map(element => ({
    id: element.id,
    role: element.role,
    name: element.name,
    email: element.email,
    phone: element.phone,
    transactions: processTransactions(element.transactions),
    targets: processTargets(element.targets)
  }));
  res.status(200).json(data);
});

const processTransactions = (transactions) => {
  let map = new Map(Object.entries({
    Contributions: 0,
    Fine: 0
  }));
  transactions.forEach(element => {
    let key = element.category;
    let currentValue = map.get(key);
    if (currentValue === undefined) {
      map.set("Contributions", map.get("Contributions") + element.amount)
    } else {
      map.set(key, currentValue + element.amount);
    }
  });
  return Object.fromEntries(map);
}
const processTargets = (targets) => {
  let map = new Map(Object.entries({
    Contributions: 0,
    Fine: 0
  }));
  targets.forEach(element => {
    let key = element.category;
    let currentValue = map.get(key);
    if (currentValue === undefined) {
      map.set("Contributions", map.get("Contributions") + element.amount)
    } else {
      map.set(key, currentValue + element.amount);
    }
  });
  return Object.fromEntries(map);
}

const convertDate = (dateStr) => {
  const date = new Date(dateStr);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
}
