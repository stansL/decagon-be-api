const mongoose = require("mongoose");
const CycleInstanceSchema = new mongoose.Schema({
  meetingType: {
    type: String,
    required: [true, "Please add the instance type"],
    enum: ["Regular", "Get Together"],
  },
  present: {
    // Array of strings
    type: [String],
    required: true,
  },
  absent: {
    type: [String],
  },
  apologies: {
    type: [String],
  },
  comment: String,
  minutes: String,
  meetingDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalContributions: Number,
  totalExpenses: Number,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  cycle: {
    type: mongoose.Schema.ObjectId,
    ref: "Cycle",
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Static method to get getTotalContributions for all instances in a cycle
CycleInstanceSchema.statics.getTotalContributions = async function (cycleId) {
  console.log(`Computing average costs for ${cycleId}....`.blue);
  const obj = await this.aggregate([
    {
      $match: { cycle: cycleId },
    },
    {
      $group: {
        _id: "$cycle",
        cycleContributions: { $sum: "$totalContributions" },
      },
    },
  ]);

  const cycleContributions = obj[0] ? obj[0].cycleContributions : undefined;
  try {
    await this.model("Cycle").findByIdAndUpdate(cycleId, {
      //TODO - check if there is the ripple effect from the cycle instance transactions
      cycleContributions,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getTotalContributions after save
CycleInstanceSchema.post("save", async function () {
  await this.constructor.getTotalContributions(this.cycle);
});

// Call getTotalContributions after remove
CycleInstanceSchema.post("remove", async function () {
  await this.constructor.getAverageCost(this.cycle);
});

// // Call getTotalContributions after totalContributions update
CycleInstanceSchema.post("findOneAndUpdate", async function (doc) {
  if (this.totalContributions != doc.totalContributions) {
    await doc.constructor.getTotalContributions(doc.cycle);
  }
});

// Reverse populate with virtuals
CycleInstanceSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "cycle_instance",
  justOne: false,
});

module.exports = mongoose.model("CycleInstance", CycleInstanceSchema);
