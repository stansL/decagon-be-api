const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
// const Bootcamp = require('./models/Bootcamp');
// const Course = require('./models/Course');
// const User = require('./models/User');
// const Review = require('./models/Review');
const Cycle = require("./models/Cycle");
const CycleInstance = require("./models/CycleInstance");
const Beneficiary = require("./models/Beneficiary");
const Target = require("./models/Target");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
// const bootcamps = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
// );

// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
// );

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );

// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
// );
const cycles = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/cycles.json`, "utf-8")
);
const cycle_instances = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/cycle_instances.json`, "utf-8")
);
const beneficiaries = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/beneficiaries.json`, "utf-8")
);
const targets = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/targets.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    // await User.create(users);
    // await Review.create(reviews);
    await Cycle.create(cycles);
    // await CycleInstance.create(cycle_instances);
    // await Beneficiary.create(beneficiaries);
    // await Target.create(targets);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // await Bootcamp.deleteMany();
    // await Course.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    await Cycle.deleteMany();
    await CycleInstance.deleteMany();
    await Beneficiary.deleteMany();
    await Target.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
