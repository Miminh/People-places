const multer = require("multer");
const aws = require("aws-sdk");
const { v1: uuid } = require("uuid");
const multerS3 = require("multer-s3");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "us-east-2",
});

const s3 = new aws.S3();

// const fileUpload = multer({
//   limits: 500000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads/images");
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uuid() + "." + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     let error = isValid ? null : new Error("Invalid mime type!");
//     cb(error, isValid);
//   },
// });

const fileUpload = multer({
  limits: 500000,
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    key: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname });
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
