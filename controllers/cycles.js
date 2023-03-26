// const path = require('path');
const slugify = require("slugify");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// const geocoder = require('../utils/geocoder');
const Cycle = require("../models/Cycle");

// @desc      Get all cycles
// @route     GET /api/v1/cycles
// @access    Public
exports.getCycles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Cycle
// @route     GET /api/v1/cycles/:id
// @access    Public
exports.getCycle = asyncHandler(async (req, res, next) => {
  // const cycle = await Cycle.findById(req.params.id).populate("cycle_instances","meetingDate meetingType");
  const cycle = await Cycle.findById(req.params.id).populate({
    path: "cycle_instances",
    select: "meetingDate meetingType",
  });

  if (!cycle) {
    return next(
      new ErrorResponse(`Cycle with id of ${req.params.id} not found `, 404)
    );
  }
  res.status(200).json({ success: true, data: cycle });
});

// @desc      Create new cycle
// @route     POST /api/v1/cycles
// @access    Private
exports.createCycle = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  // Add user to req,body
  // req.body.user = req.user.id;

  // If the user is not an admin, they can only add one bootcamp
  // if (req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `The user with ID ${req.user.id} cannot create a cycle`,
  //       400
  //     )
  //   );
  // }

  const cycle = await Cycle.create(req.body);

  res.status(201).json({
    success: true,
    data: cycle,
  });
});

// @desc      Update cycle
// @route     PUT /api/v1/cycles/:id
// @access    Private
exports.updateCycle = asyncHandler(async (req, res, next) => {
  let cycle = await Cycle.findById(req.params.id);

  if (!cycle) {
    return next(
      new ErrorResponse(`Cycle not found with id of ${req.params.id}`, 404)
    );
  }

  // // Make sure user is admin
  // if (cycle.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to update this cycle`,
  //       401
  //     )
  //   );
  // }

  // update slug while updating name
  if (Object.keys(req.body).includes("name")) {
    req.body.slug = slugify(req.body.name, { lower: true });
  }

  cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: cycle });
});

// @desc      Delete cycle
// @route     DELETE /api/v1/cycles/:id
// @access    Private
exports.deleteCycle = asyncHandler(async (req, res, next) => {
  const cycle = await Cycle.findById(req.params.id);

  if (!cycle) {
    return next(
      new ErrorResponse(`Cycle not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user admin
  // if (req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete cycles`,
  //       401
  //     )
  //   );
  // }

  await cycle.remove(); //triggers middlewares - use this instead of findByIdAndDelete

  res.status(200).json({ success: true, data: {} });
});

// // @desc      Get bootcamps within a radius
// // @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// // @access    Private
// exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
//   const { zipcode, distance } = req.params;

//   // Get lat/lng from geocoder
//   const loc = await geocoder.geocode(zipcode);
//   const lat = loc[0].latitude;
//   const lng = loc[0].longitude;

//   // Calc radius using radians
//   // Divide dist by radius of Earth
//   // Earth Radius = 3,963 mi / 6,378 km
//   const radius = distance / 3963;

//   const bootcamps = await Bootcamp.find({
//     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
//   });

//   res.status(200).json({
//     success: true,
//     count: bootcamps.length,
//     data: bootcamps
//   });
// });

// // @desc      Upload photo for bootcamp
// // @route     PUT /api/v1/bootcamps/:id/photo
// // @access    Private
// exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
//   const bootcamp = await Bootcamp.findById(req.params.id);

//   if (!bootcamp) {
//     return next(
//       new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
//     );
//   }

//   // Make sure user is bootcamp owner
//   if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new ErrorResponse(
//         `User ${req.user.id} is not authorized to update this bootcamp`,
//         401
//       )
//     );
//   }

//   if (!req.files) {
//     return next(new ErrorResponse(`Please upload a file`, 400));
//   }

//   const file = req.files.file;

//   // Make sure the image is a photo
//   if (!file.mimetype.startsWith('image')) {
//     return next(new ErrorResponse(`Please upload an image file`, 400));
//   }

//   // Check filesize
//   if (file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
//         400
//       )
//     );
//   }

//   // Create custom filename
//   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
//     if (err) {
//       console.error(err);
//       return next(new ErrorResponse(`Problem with file upload`, 500));
//     }

//     await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

//     res.status(200).json({
//       success: true,
//       data: file.name
//     });
//   });
// });
