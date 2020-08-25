const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordinates = require("../utils/location");
const Places = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Places.findById(placeId);
  } catch (err) {
    return next(new HttpError("Error connecting to Db", 500));
  }
  if (!place) {
    return next(new HttpError("Place doest not exist for Id", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Places.find({ creator: userId });
  } catch (err) {
    return next(new HttpError("Error Connecting to DB", 500));
  }
  if (!places || places.length === 0) {
    return next(new HttpError("Place doest not exist for user Id", 404));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data, please check your values", 422));
  }
  //Object Destructuring
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinates(address);
  } catch (e) {
    return next(new HttpError(e.message, 402));
  }
  const createdPlace = new Places({
    title,
    description,
    image: req.file.location,
    address,
    location: coordinates,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Unable to connect to the Db", 401));
  }

  if (!user) {
    return next(new HttpError("User does not exist for the given Id"));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("creating place failed", 401));
  }

  res.status(201).json({ places: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data, please check your values", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Places.findById(placeId);
  } catch (err) {
    return next(new HttpError("Something went wrong, could not update", 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("Action not allowed due to authorization", 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError("Could not Update", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Places.findById(placeId).populate("creator");
  } catch (err) {
    return next(new HttpError("Could not delete", 500));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("Action not allowed, due to authorization", 401));
  }

  if (!place) {
    return next(new HttpError("No such place Exists"));
  }
  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });

    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Could not delete : " + err.message, 500));
  }

  // try{
  //   await Places.findByIdAndDelete(placeId);
  // }catch(error){
  //   return next(new HttpError('Could not delete', 500))
  // }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted Successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
