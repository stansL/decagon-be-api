const mongoose = require("mongoose");
const { TransactionType } = require("./TransactionType");

const TargetSchema = new mongoose.Schema({
  category: {
    type: TransactionType,
    required: [true, "Please add a category"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  amount: {
    type: Number,
    required: [true, "Please add the amount"],
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
  cycle: {
    type: mongoose.Schema.ObjectId,
    ref: "Cycle",
    required: true,
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get total of cycle targets and save
// TODO convert into cycle targets inner property
TargetSchema.statics.getCycleTotal = async function (cycleId) {
  const obj = await this.aggregate([
    {
      $match: { cycle: cycleId },
    },
    {
      $group: {
        _id: "$cycle",
        targetTotal: { $sum: "$amount" },
      },
    },
  ]);

  const targetTotal = obj[0] ? obj[0].targetTotal : undefined;
  try {
    await this.model("Cycle").findByIdAndUpdate(cycleId, {
      targetTotal,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getCycleTotal after save
TargetSchema.post("save", async function () {
  await this.constructor.getCycleTotal(this.cycle);
});

// Call getCycleTotal after remove
TargetSchema.post("remove", async function () {
  await this.constructor.getCycleTotal(this.cycle);
});

// Call getCycleTotal after amount update
TargetSchema.post("findOneAndUpdate", async function (doc) {
  if (this.amount != doc.amount) {
    await doc.constructor.getCycleTotal(doc.cycle);
  }
});

// Prevent more than one target per cycle
TargetSchema.index({ cycle: 1, member: 1 }, { unique: true });

module.exports = mongoose.model("Target", TargetSchema);
