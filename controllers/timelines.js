const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const TimelineEvent = require('../models/TimelineEvent');


// @desc      Get timelines
// @route     GET /api/v1/timelines
// @access    Public
exports.getTimelines = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single timelines
// @route     GET /api/v1/timelines/:id
// @access    Public
exports.getTimeline = asyncHandler(async (req, res, next) => {
  const timeline = await TimelineEvent.findById(req.params.id)
    .populate({
      path: 'User',
      select: 'name'
    });

  if (!timeline) {
    return next(
      new ErrorResponse(`No Event with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc      Add Timelines
// @route     POST /api/v1/timelines
// @access    Private
exports.addTimeline = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const timeline = await TimelineEvent.create(req.body);
  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc      Update Timeline
// @route     PUT /api/v1/timelines/:id
// @access    Private
exports.updateTimeline = asyncHandler(async (req, res, next) => {
  let timeline = await TimelineEvent.findById(req.params.id);

  if (!timeline) {
    return next(
      new ErrorResponse(`No evenet with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has admin/welfare
  if (!["admin", "finance", "welfare"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update event ${timeline._id}`,
        401
      )
    );
  }

  timeline = await TimelineEvent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  timeline.save();

  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc      Delete timeline
// @route     DELETE /api/v1/timeline/:id
// @access    Private
exports.deleteTimeline = asyncHandler(async (req, res, next) => {
  const timeline = await TimelineEvent.findById(req.params.id);

  if (!timeline) {
    return next(
      new ErrorResponse(`No timeline with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has welfare/admin/finance role
  if (!["admin","finance", "welfare"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete event ${timeline._id}`,
        401
      )
    );
  }

  await timeline.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
