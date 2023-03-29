const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Transaction = require('../models/Transaction');
const CycleInstance = require('../models/CycleInstance');

// @desc      Get transactions
// @route     GET /api/v1/transactions
// @route     GET /api/v1/cycle_instances/:cycleInstanceId/transactions
// @access    Public
exports.getTransactions = asyncHandler(async (req, res, next) => {
  if (req.params.cycleInstanceId) {
    const transactions = await Transaction.find({ cycle_instance: req.params.cycleInstanceId });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single transaction
// @route     GET /api/v1/transactions/:id
// @access    Public
exports.getTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
    // .populate({
    //   path: 'cycle_instance',
    //   select: 'name description'
    // })
    ;

  if (!transaction) {
    return next(
      new ErrorResponse(`No transaction with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc      Add transaction
// @route     POST /api/v1/cycle_instances/:cycleInstanceId/transactions
// @access    Private
exports.addTransaction = asyncHandler(async (req, res, next) => {
  req.body.cycle_instance = req.params.cycleInstanceId;
  req.body.createdBy = req.user.id;

  const cycle_instance = await CycleInstance.findById(req.params.cycleInstanceId);

  if (!cycle_instance) {
    return next(
      new ErrorResponse(
        `No cycle instance with the id of ${req.params.cycleInstanceId}`,
        404
      )
    );
  }

  // Make sure user has finance/admin role
  if (!["admin", "finance"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a transaction to cycle instance ${cycle_instance._id}`,
        401
      )
    );
  }

  const transaction = await Transaction.create(req.body);

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc      Update transaction
// @route     PUT /api/v1/transactions/:id
// @access    Private
exports.updateTransaction = asyncHandler(async (req, res, next) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`No transaction with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has finance/admin role
  if (!["admin", "finance"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update transaction ${transaction._id}`,
        401
      )
    );
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  transaction.save();

  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc      Delete transaction
// @route     DELETE /api/v1/transactions/:id
// @access    Private
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(`No transaction with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has finance/admin role
  if (!["admin", "finance"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete transaction ${transaction._id}`,
        401
      )
    );
  }

  await transaction.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
