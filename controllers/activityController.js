const multer = require('multer');
const sharp = require('sharp');
const Activity = require('../models/activityModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // console.warn('req::', req);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadActivityImages = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'imageCover', maxCount: 1 }
]);

exports.resizeActivityImages = catchAsync(async (req, res, next) => {
  if (!req.files.image || !req.files.imageCover) return next();
  // 1) Image
  req.body.image = `activity-${req.params.id ||
    req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/activities/${req.body.image}`);

  // 2) Cover image
  req.body.imageCover = `activities-${req.params.id ||
    req.user.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/activities/${req.body.imageCover}`);

  next();
});

exports.getAllActivities = factory.getAll(Activity);
exports.getActivity = factory.getOne(Activity, [
  {
    path: 'coaches',
    select: 'name'
  },
  {
    path: 'moderators',
    select: 'name'
  },
  {
    path: 'belts',
    select: 'name'
  }
]);
exports.createActivity = factory.createOne(Activity);
exports.updateActivity = factory.updateOne(Activity);
exports.deleteActivity = factory.deleteOne(Activity);
