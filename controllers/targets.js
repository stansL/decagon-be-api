const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Target = require("../models/Target");
const Cycle = require("../models/Cycle");
const User = require("../models/User");

// @desc      Get targets
// @route     GET /api/v1/targets
// @route     GET /api/v1/cycles/:cycleId/targets
// @route     GET /api/v1/users/:userId/targets
// @access    Public
exports.getTargets = asyncHandler(async (req, res, next) => {
  if (req.params.cycleId) {
    const targets = await Target.find({ cycle: req.params.cycleId });
    return res.status(200).json({
      success: true,
      count: targets.length,
      data: targets,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single target
// @route     GET /api/v1/targets/:id
// @access    Public
exports.getTarget = asyncHandler(async (req, res, next) => {
  const target = await Target.findById(req.params.id).populate({
    path: "cycle",
    select: "name slug",
  });
  // TODO - populate user details

  if (!target) {
    return next(
      new ErrorResponse(`No target with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: target,
  });
});

// @desc      Add target
// @route     POST /api/v1/cycles/:cycleId/targets
// @access    Private
exports.addTarget = asyncHandler(async (req, res, next) => {
  req.body.cycle = req.params.cycleId;
  req.body.createdBy = req.user.id;

  const cycle = await Cycle.findById(req.params.cycleId);

  if (!cycle) {
    return next(
      new ErrorResponse(`No cycle with the id of ${req.params.cycleId}`, 404)
    );
  }

  // Make sure user is finance
  if (!["admin", "finance"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is ${req.user.role} not authorized to add a target to cycle ${cycle._id}`,
        401
      )
    );
  }

  const target = await Target.create(req.body);

  res.status(201).json({
    success: true,
    data: target,
  });
});

// @desc      Update target
// @route     PUT /api/v1/targets/:id
// @access    Private
exports.updateTarget = asyncHandler(async (req, res, next) => {
  let target = await Target.findById(req.params.id);

  if (!target) {
    return next(
      new ErrorResponse(`No target with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or finance
  if (!["admin", "finance"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update target ${target._id}`,
        401
      )
    );
  }

  target = await Target.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  target.save();

  res.status(200).json({
    success: true,
    data: target,
  });
});

// @desc      Delete target
// @route     DELETE /api/v1/targets/:id
// @access    Private
exports.deleteTarget = asyncHandler(async (req, res, next) => {
  const target = await Target.findById(req.params.id);

  if (!target) {
    return next(
      new ErrorResponse(`No target with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or finance
  if (!["admin", "finance"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete target ${target._id}`,
        401
      )
    );
  }

  await target.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
