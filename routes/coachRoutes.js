const express = require('express');
const coachController = require('../controllers/coachController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(coachController.getAllCoaches)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    coachController.uploadCoachImages,
    coachController.resizeCoachImages,
    coachController.createCoach
  );

router
  .route('/:id')
  .get(coachController.getCoach)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    coachController.uploadCoachImages,
    coachController.resizeCoachImages,
    coachController.updateCoach
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    coachController.deleteCoach
  );

module.exports = router;
