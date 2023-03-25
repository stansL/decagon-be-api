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
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  cycle: {
    type: mongoose.Schema.ObjectId,
    ref: "Cycle",
    required: true,
  },
});

// // Static method to get avg of course tuitions
// CourseSchema.statics.getAverageCost = async function(bootcampId) {
//   const obj = await this.aggregate([
//     {
//       $match: { bootcamp: bootcampId }
//     },
//     {
//       $group: {
//         _id: '$bootcamp',
//         averageCost: { $avg: '$tuition' }
//       }
//     }
//   ]);

//   const averageCost = obj[0]
//     ? Math.ceil(obj[0].averageCost / 10) * 10
//     : undefined;
//   try {
//     await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
//       averageCost,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// // Call getAverageCost after save
// CourseSchema.post('save', async function() {
//   await this.constructor.getAverageCost(this.bootcamp);
// });

// // Call getAverageCost after remove
// CourseSchema.post('remove', async function () {
//   await this.constructor.getAverageCost(this.bootcamp);
// });

// // Call getAverageCost after tuition update
// CourseSchema.post("findOneAndUpdate", async function (doc) {
//   if (this.tuition != doc.tuition) {
//     await doc.constructor.getAverageCost(doc.bootcamp);
//   }
// });

module.exports = mongoose.model("CycleInstance", CycleInstanceSchema);
