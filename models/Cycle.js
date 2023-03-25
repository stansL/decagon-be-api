const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
// const geocoder = require("../utils/geocoder");

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
  // address: {
  //   type: String,
  //   required: [true, "Please add an address"],
  // },
  // location: {
  //   // GeoJSON Point
  //   type: {
  //     type: String,
  //     enum: ["Point"],
  //   },
  //   coordinates: {
  //     type: [Number],
  //     index: "2dsphere",
  //   },
  //   formattedAddress: String,
  //   street: String,
  //   city: String,
  //   state: String,
  //   zipcode: String,
  //   country: String,
  // },
});

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

// // Cascade delete courses when a bootcamp is deleted
// BootcampSchema.pre('remove', async function(next) {
//   console.log(`Courses being removed from bootcamp ${this._id}`);
//   await this.model('Course').deleteMany({ bootcamp: this._id });
//   console.log(`Reviews being removed from bootcamp ${this._id}`);
//    await this.model('Review').deleteMany({ bootcamp: this._id });
//   next();
// });

// // Reverse populate with virtuals
// BootcampSchema.virtual('courses', {
//   ref: 'Course',
//   localField: '_id',
//   foreignField: 'bootcamp',
//   justOne: false
// });

module.exports = mongoose.model("Cycle", CycleSchema);
