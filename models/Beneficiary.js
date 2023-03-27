const mongoose = require("mongoose");
const { BeneficiaryType } = require("./BeneficiaryType");

const BeneficiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  description: {
    type: String,
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  relationship: {
    type: BeneficiaryType,
    required: [true, "Please add a beneficiary type"],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);
