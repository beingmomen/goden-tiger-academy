const express = require('express');
const playerController = require('../controllers/playerController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(playerController.getAllPlayers)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    playerController.uploadPlayerImages,
    playerController.resizePlayerImages,
    playerController.createPlayer
  );

router
  .route('/:id')
  .get(playerController.getPlayer)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    playerController.uploadPlayerImages,
    playerController.resizePlayerImages,
    playerController.updatePlayer
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    playerController.deletePlayer
  );

module.exports = router;
