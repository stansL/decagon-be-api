const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Beneficiary = require("../models/Beneficiary");
const { BeneficiaryType } = require("../models/BeneficiaryType");

// @desc      Get all beneficiaries
// @route     GET /api/v1/beneficiaries
// @access    Public
exports.getBeneficiaries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single beneficiary
// @route     GET /api/v1/beneficiaries/:id
// @access    Public
exports.getBeneficiary = asyncHandler(async (req, res, next) => {
  const beneficiary = await Beneficiary.findById(req.params.id);

  if (!beneficiary) {
    return next(
      new ErrorResponse(
        `Beneficiary not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: beneficiary });
});

// @desc      Create new beneficiary
// @route     POST /api/v1/beneficiaries
// @access    Private
exports.createBeneficiary = asyncHandler(async (req, res, next) => {
  // User can only add beneficiary if welfare or admin
  if (!["admin", "welfare"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} not allowed to add welfare links`,
        400
      )
    );
  }

  // Check if member exists
  const member = await User.findById(req.body.member);
  if (!member) {
    return next(
      new ErrorResponse(`Member not found with id of ${req.body.member}`, 404)
    );
  }
  // Add createdBy to req.body
  req.body.createdBy = req.user.id;
  const beneficiary = await Beneficiary.create(req.body);

  res.status(201).json({
    success: true,
    data: beneficiary,
  });
});

// @desc      Update beneficiary
// @route     PUT /api/v1/beneficiaries/:id
// @access    Private
exports.updateBeneficiary = asyncHandler(async (req, res, next) => {
  let beneficiary = await Beneficiary.findById(req.params.id);

  if (!beneficiary) {
    return next(
      new ErrorResponse(
        `Beneficiary not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is principle member, welfare or admin
  if (
    beneficiary.member.toString() !== req.user.id &&
    !["admin", "welfare"].includes(req.user.role)
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this beneficiary`,
        401
      )
    );
  }

  beneficiary = await Beneficiary.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: beneficiary });
});

// @desc      Delete beneficiary
// @route     DELETE /api/v1/beneficiaries/:id
// @access    Private
exports.deleteBeneficiary = asyncHandler(async (req, res, next) => {
  const beneficiary = await Beneficiary.findById(req.params.id);

  if (!beneficiary) {
    return next(
      new ErrorResponse(
        `Beneficiary not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is beneficiary owner or has role welfare or admin
  if (
    beneficiary.member.toString() !== req.user.id &&
    !["admin", "welfare"].includes(req.user.role)
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this beneficiary`,
        401
      )
    );
  }

  await beneficiary.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for beneficiary
// @route     PUT /api/v1/beneficiaries/:id/photo
// @access    Private
exports.beneficiaryPhotoUpload = asyncHandler(async (req, res, next) => {
  const beneficiary = await Beneficiary.findById(req.params.id);

  if (!beneficiary) {
    return next(
      new ErrorResponse(
        `Beneficiary not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure member is beneficiary owner or has roles welfare or admin
  if (
    beneficiary.member.toString() !== req.user.id &&
    !["admin", "welfare"].includes(req.user.role)
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this beneficiary`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${beneficiary._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Beneficiary.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
