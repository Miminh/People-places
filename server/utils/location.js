const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

const getCoordinates = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
  );

  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError("No coordinates found for given address", 422);
  }
  const coordinate = data.results[0].geometry.location;

  return coordinate;
};

module.exports = getCoordinates;
