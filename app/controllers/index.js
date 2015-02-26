var Movie = require('../models/movie');

// index page
exports.index = function(req, res) {
	console.log('user in session:');
	console.log(req.session.user);

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		// res.render 有2个参数：跳转的模板页，跳转需要的参数
		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		});
	});
}