const express = require("express");
const {
  beneficiaryPhotoUpload,
  getBeneficiaries,
  createBeneficiary,
  getBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} = require("../controllers/beneficiaries");

const Beneficiary = require("../models/Beneficiary");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/:id/photo")
  .put(protect, authorize("welfare", "admin"), beneficiaryPhotoUpload);

router
  .route("/")
  .get(advancedResults(Beneficiary), getBeneficiaries)
  .post(protect, authorize("welfare", "admin"), createBeneficiary);

router
  .route("/:id")
  .get(getBeneficiary)
  .put(protect, authorize("welfare", "admin"), updateBeneficiary)
  .delete(protect, authorize("welfare", "admin"), deleteBeneficiary);

module.exports = router;
