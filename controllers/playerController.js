const multer = require('multer');
const sharp = require('sharp');
const Player = require('../models/playerModel');
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

exports.uploadPlayerImages = upload.fields([{ name: 'image', maxCount: 1 }]);

exports.resizePlayerImages = catchAsync(async (req, res, next) => {
  if (!req.files.image) return next();
  // 1) Image
  req.body.image = `player-${req.params.id || req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/players/${req.body.image}`);

  next();
});

exports.getAllPlayers = factory.getAll(Player);
exports.getPlayer = factory.getOne(Player);
exports.createPlayer = factory.createOne(Player);
exports.updatePlayer = factory.updateOne(Player);
exports.deletePlayer = factory.deleteOne(Player);
