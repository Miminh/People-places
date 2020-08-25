const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PATCH");
  next();
});

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  throw new HttpError("No Such Page Found", 404);
});

app.use((error, req, res, next) => {
  if (!error) {
    return next(error);
  }
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.status || 500);
  res.json({ message: error.message || "Some unknown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mimin-tnq81.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => {
    console.log(error.message);
  });
