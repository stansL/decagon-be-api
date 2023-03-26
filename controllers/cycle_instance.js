const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const CycleInstance = require("../models/CycleInstance");
const Cycle = require("../models/Cycle");

// @desc      Get Cycle Instances
// @route     GET /api/v1/cycleinstances
// @route     GET /api/v1/cycles/:cycleId/cycleinstances
// @route     GET /api/v1/users/:userId/cycleinstances
// @access    Public
exports.getCycleInstances = asyncHandler(async (req, res, next) => {
  if (req.params.cycleId) {
    const cycleInstances = await CycleInstance.find({
      cycle: req.params.cycleId,
    });
    return res.status(200).json({
      success: true,
      count: cycleInstances.length,
      data: cycleInstances,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single cycle instance
// @route     GET /api/v1/cycleinstances/:id
// @access    Public
exports.getCycleInstance = asyncHandler(async (req, res, next) => {
  const cycleInstance = await CycleInstance.findById(req.params.id).populate({
    path: "cycle",
    select: "name slug",
  });

  if (!cycleInstance) {
    return next(
      new ErrorResponse(
        `No cycle instance with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: cycleInstance,
  });
});

// @desc      Add Cycle Instance
// @route     POST /api/v1/cycles/:cycleId/cycleInstances
// @access    Private
exports.addCycleInstance = asyncHandler(async (req, res, next) => {
  req.body.cycle = req.params.cycleId;
  // req.body.user = req.user.id;

  const cycle = await Cycle.findById(req.params.cycleId);

  if (!cycle) {
    return next(
      new ErrorResponse(`No cycle with the id of ${req.params.cycleId}`, 404)
    );
  }

  // // Make sure user is admin
  // if (req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to add a cycle instance`,
  //       401
  //     )
  //   );
  // }

  const cycleInstance = await CycleInstance.create(req.body);

  res.status(200).json({
    success: true,
    data: cycleInstance,
  });
});

// // @desc      Update course
// // @route     PUT /api/v1/courses/:id
// // @access    Private
// exports.updateCourse = asyncHandler(async (req, res, next) => {
//   let course = await Course.findById(req.params.id);

//   if (!course) {
//     return next(
//       new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
//     );
//   }

//   // Make sure user is course owner
//   if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(
//       new ErrorResponse(
//         `User ${req.user.id} is not authorized to update course ${course._id}`,
//         401
//       )
//     );
//   }

//   course = await Course.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   course.save();

//   res.status(200).json({
//     success: true,
//     data: course,
//   });
// });

// // @desc      Delete course
// // @route     DELETE /api/v1/courses/:id
// // @access    Private
// exports.deleteCourse = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course) {
//     return next(
//       new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
//     );
//   }

//   // Make sure user is course owner
//   if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(
//       new ErrorResponse(
//         `User ${req.user.id} is not authorized to delete course ${course._id}`,
//         401
//       )
//     );
//   }

//   await course.remove();

//   res.status(200).json({
//     success: true,
//     data: {},
//   });
// });
