const express = require('express');
const moderatorController = require('../controllers/moderatorController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(moderatorController.getAllModerators)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    moderatorController.uploadModeratorImages,
    moderatorController.resizeModeratorImages,
    moderatorController.createModerator
  );

router
  .route('/:id')
  .get(moderatorController.getModerator)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    moderatorController.uploadModeratorImages,
    moderatorController.resizeModeratorImages,
    moderatorController.updateModerator
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    moderatorController.deleteModerator
  );

module.exports = router;
