const multer = require('multer');
const sharp = require('sharp');
const Coach = require('../models/coachModel');
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

exports.uploadCoachImages = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizeCoachImages = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();
  // 1) Image
  req.body.image = `coach-${req.params.id || req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/coaches/${req.body.image}`);

  next();
});

exports.getAllCoaches = factory.getAll(Coach);
exports.getCoach = factory.getOne(Coach);
exports.createCoach = factory.createOne(Coach);
exports.updateCoach = factory.updateOne(Coach);
exports.deleteCoach = factory.deleteOne(Coach);
