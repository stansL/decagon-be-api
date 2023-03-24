const mongoose = require("mongoose");

const CycleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  targets: {
    annual: Number,
    monthlies: Number,
    welfare: Number,
    getTogether: Number,
  },
  totalContributions: Number,
  averageContributions: Number,
  totalExpenses: Number,
});

module.exports = mongoose.model("Cycle", CycleSchema);
