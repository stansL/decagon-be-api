const mongoose = require("mongoose");
const { TransactionType } = require("./TransactionType");

const TransactionSchema = new mongoose.Schema({
  category: {
    type: TransactionType,
    required: [true, "Please add a category"],
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, "Please add the amount"],
  },
  cost: {
    type: Number,
    required: [true, "Please add the amount"],
    default: 0,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
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
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  modifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  cycle_instance: {
    type: mongoose.Schema.ObjectId,
    ref: "CycleInstance",
    required: true,
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  voided: {
    type: Boolean,
    default: false
  }
});

// Static method to get instance total contributions
TransactionSchema.statics.getTotalContributions = async function (instanceId) {
  const obj = await this.aggregate([
    {
      $match: { cycle_instance: instanceId },
    },
    {
      $group: {
        _id: "$cycle_instance",
        totalContributions: { $sum: "$amount" },
      },
    },
  ]);

  const totalContributions = obj[0] ? obj[0].totalContributions : undefined;
  try {
    await this.model("CycleInstance").findByIdAndUpdate(instanceId, {
      totalContributions,
    });
  } catch (err) {
    console.log(err);
  }
};

// Call getTotalContributions after save
TransactionSchema.post("save", async function () {
  await this.constructor.getTotalContributions(this.cycle_instance);
});

// Call getTotalContributions after remove
TransactionSchema.post("remove", async function () {
  await this.constructor.getTotalContributions(this.cycle_instance);
});

// Call getTotalContributions after amount update
TransactionSchema.post("findOneAndUpdate", async function (doc) {
  if (this.amount != doc.amount) {
    await doc.constructor.getTotalContributions(doc.cycle_instance);
  }
});


module.exports = mongoose.model("Transaction", TransactionSchema);
