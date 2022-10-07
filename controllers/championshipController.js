const Championship = require('../models/championshipModel');
const factory = require('./handlerFactory');

exports.getAllChampionships = factory.getAll(Championship);
exports.getChampionship = factory.getOne(Championship);
exports.createChampionship = factory.createOne(Championship);
exports.updateChampionship = factory.updateOne(Championship);
exports.deleteChampionship = factory.deleteOne(Championship); 
