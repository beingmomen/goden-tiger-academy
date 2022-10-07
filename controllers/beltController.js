const Belt = require('../models/beltModel');
const factory = require('./handlerFactory');

const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
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

exports.uploadBeltImages = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizeBeltImages = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();
  // 1) Image
  req.body.image = `belt-${req.params.id ||
    req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/belts/${req.body.image}`);

  next();
});

exports.getAllBelts = factory.getAll(Belt);
exports.getBelt = factory.getOne(Belt);
exports.createBelt = factory.createOne(Belt);
exports.updateBelt = factory.updateOne(Belt);
exports.deleteBelt = factory.deleteOne(Belt); 
