const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else {
    try {
      let token = req.headers.authorization.split(" ")[1];
      if (token == null) {
        return next(new Error("Authentication Failed"));
      }
      let decodedData = jwt.verify(token, process.env.JWT_KEY);
      req.userData = { userId: decodedData.userId };
      next();
    } catch (error) {
      return next(
        new HttpError("Authentication Failed! : " + error.message, 402)
      );
    }
  }
};
