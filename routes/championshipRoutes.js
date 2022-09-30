const express = require('express');
const championshipController = require('../controllers/championshipController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(championshipController.getAllChampionships)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    championshipController.createChampionship
  );

router
  .route('/:id')
  .get(championshipController.getChampionship)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    championshipController.updateChampionship
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    championshipController.deleteChampionship
  );

module.exports = router;
