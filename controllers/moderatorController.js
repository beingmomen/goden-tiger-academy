const multer = require('multer');
const sharp = require('sharp');
const Moderator = require('../models/moderatorModel');
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

exports.uploadModeratorImages = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizeModeratorImages = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();
  // 1) Image
  req.body.image = `moderator-${req.params.id ||
    req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/moderators/${req.body.image}`);

  next();
});

exports.getAllModerators = factory.getAll(Moderator);
exports.getModerator = factory.getOne(Moderator);
exports.createModerator = factory.createOne(Moderator);
exports.updateModerator = factory.updateOne(Moderator);
exports.deleteModerator = factory.deleteOne(Moderator);
