const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
// const geocoder = require("../utils/geocoder");

const CycleSchema = new mongoose.Schema(
  {
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
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    targets: {
      annual: Number,
      monthlies: Number,
      welfare: Number,
      getTogether: Number,
    },
    cycleContributions: Number,
    cycleExpenses: Number,
    targetTotal: Number,
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

// Create bootcamp slug from the name
CycleSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// // Geocode & create location field
// CycleSchema.pre("save", async function (next) {
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: "Point",
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipcode: loc[0].zipcode,
//     country: loc[0].countryCode,
//   };

//   // Do not save address in DB
//   this.address = undefined;
//   next();
// });

// Cascade delete cycle instances when a cycle is deleted
CycleSchema.pre("remove", async function (next) {
  console.log(`Instances being removed from cycle ${this._id}`);
  await this.model("CycleInstance").deleteMany({ cycle: this._id });
  // console.log(`Reviews being removed from bootcamp ${this._id}`);
  //  await this.model('Review').deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals
CycleSchema.virtual("cycle_instances", {
  ref: "CycleInstance",
  localField: "_id",
  foreignField: "cycle",
  justOne: false,
});

module.exports = mongoose.model("Cycle", CycleSchema);
