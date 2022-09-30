const express = require('express');
const activityController = require('../controllers/activityController');
const authController = require('../controllers/authController');
const championshipRouter = require('./../routes/championshipRoutes');

const router = express.Router();

router.use('/:activityId/championships', championshipRouter);

router
  .route('/')
  .get(activityController.getAllActivities)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    activityController.uploadActivityImages,
    activityController.resizeActivityImages,
    activityController.createActivity
  );

router
  .route('/:id')
  .get(activityController.getActivity)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    activityController.uploadActivityImages,
    activityController.resizeActivityImages,
    activityController.updateActivity
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    activityController.deleteActivity
  );

module.exports = router;
