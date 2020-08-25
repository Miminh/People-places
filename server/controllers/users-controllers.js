const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const users = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Error connecting to db"));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data, please check your inputs"));
  }
  const { name, email, password } = req.body;
  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Could not connect to the Database", 422));
  }
  if (userExists) {
    return next(new HttpError("The User Email Already exists", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Something went wrong, please try again", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.location,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Something went wrong, " + err.message, 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  res.status(201).json({ userId: createdUser.id, email: email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: email.toLowerCase() });
  } catch (error) {
    return next(new HttpError("Could not connect to the Database", 422));
  }
  if (!userExists) {
    return next(new HttpError("Invalid User email or password", 401));
  }

  let isValid = false;
  try {
    isValid = bcrypt.compare(password, userExists.password);
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong, please try again " + error.message,
        500
      )
    );
  }

  if (!isValid) {
    return next(new HttpError("Invalid User email or password", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userExists.id, email: email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  res.status(200).json({
    userId: userExists.id,
    email: email,
    token: token,
  });
};

exports.getUsers = users;
exports.login = login;
exports.signup = signup;
