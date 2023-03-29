const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userPhotoUpload,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
// router.use(authorize("admin"));

router.route("/:id/photo").put(userPhotoUpload);

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(authorize("admin"), createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(authorize("admin"), deleteUser);

module.exports = router;
