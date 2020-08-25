const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/places-controllers");
const fileUplaod = require("../middleware/file-upload");
const authCheck = require("../middleware/auth-check");
const { Router } = require("express");

const route = express.Router();

route.get("/:pid", placesController.getPlaceById);

route.get("/user/:uid", placesController.getPlacesByUserId);

route.use(authCheck);

route.post(
  "/",
  fileUplaod.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createPlace
);

route.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesController.updatePlace
);

route.delete("/:pid", placesController.deletePlace);

module.exports = route;
