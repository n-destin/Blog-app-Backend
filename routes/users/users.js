const express = require("express");
const protected = require("../../middlewares/LogginInMiddleware")
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
  // HomeCtrl
} = require("../../controllers/users/users");
const storage = require("../../config/coudinary");
const multer = require("multer");
const upload = multer({storage})
const userRoutes = express.Router();

//POST/api/v1/users/register

// userRoutes("/", HomeCtrl)
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

//GET/api/v1/users/profile/:id
userRoutes.get("/profile/:id", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload/", protected, upload.single('file'), uploadProfilePhotoCtrl);

//PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/", protected, upload.single('file'), uploadCoverImgCtrl);

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", updatePasswordCtrl);

//PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", updateUserCtrl);

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

module.exports = userRoutes;