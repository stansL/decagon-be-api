const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
// Load env vars
dotenv.config({ path: "./config/config.env" });



// Route files
// const bootcamps = require('./routes/bootcamps');
// const courses = require('./routes/courses');
const auth = require("./routes/auth");
const users = require("./routes/users");
// const reviews = require('./routes/reviews');
const cycles = require("./routes/cycles");
const cycle_instances = require("./routes/cycle_instances");
const beneficiaries = require("./routes/beneficiaries");
const targets = require("./routes/targets");
const transactions = require("./routes/transactions");
const overview = require("./routes/overview");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Optional whitelisting with cors
// var corsOptions = {
//   origin: 'http://decagonpride.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// Enable CORS
// app.use(cors(corsOptions)); Only enable for the specified 'whitelist'
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
// app.use('/api/v1/bootcamps', bootcamps);
// app.use('/api/v1/courses', courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
// app.use('/api/v1/reviews', reviews);
app.use("/api/v1/cycles", cycles);
app.use("/api/v1/cycle_instances", cycle_instances);
app.use("/api/v1/beneficiaries", beneficiaries);
app.use("/api/v1/targets", targets);
app.use("/api/v1/transactions", transactions);
app.use("/api/v1/overview", overview);

app.use(errorHandler); //put after the routes for it to work - linear nature of middlewares

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
  const server = app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
  );
});

// const server = app.listen(
//   PORT,
//   console.log(
//     `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
//   )
// );

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
