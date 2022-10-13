const express = require('express');
const beltController = require('../controllers/beltController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(beltController.getAllBelts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    beltController.uploadBeltImages,
    beltController.resizeBeltImages,
    beltController.createBelt
  );

router
  .route('/:id')
  .get(beltController.getBelt)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    beltController.uploadBeltImages,
    beltController.resizeBeltImages,
    beltController.updateBelt
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    beltController.deleteBelt
  );

module.exports = router;
