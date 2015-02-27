var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');
var Category = mongoose.model('Catetory', CategorySchema);

module.exports = Category