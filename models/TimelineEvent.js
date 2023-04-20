const mongoose = require("mongoose");


const TimelineEventSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: ["Welfare", "Get Together", "Hazina Deposit", "Dividends", "Meeting", "Cancellation"]
  },
  description: {
    type: String,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  amount: {
    type: Number,//not required
  },
  eventDate: {
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
  member: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  voided: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("TimelineEvent", TimelineEventSchema);
