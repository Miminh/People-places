const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const FileUpload = require("../middleware/file-upload");

const route = express.Router();

route.get("/", usersController.getUsers);
//
route.post(
  "/signup",
  FileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 7 }),
  ],
  usersController.signup
);

route.post("/login", usersController.login);

module.exports = route;
