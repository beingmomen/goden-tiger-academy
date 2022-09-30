const Belt = require('../models/beltModel');
const factory = require('./handlerFactory');

exports.getAllBelts = factory.getAll(Belt);
exports.getBelt = factory.getOne(Belt);
exports.createBelt = factory.createOne(Belt);
exports.updateBelt = factory.updateOne(Belt);
exports.deleteBelt = factory.deleteOne(Belt);
