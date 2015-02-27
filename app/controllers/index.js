var Movie = require('../models/movie');
var Category  = require('../models/category');

// index page
exports.index = function(req, res) {
	Category.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, categories) {
			if (err) {
				console.log(err);
			}
			// res.render 有2个参数：跳转的模板页，跳转需要的参数
			res.render('index', {
				title: 'imooc 首页',
				categories: categories
			});
		});
}