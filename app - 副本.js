var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname + '/public')));
app.listen(port);
app.use(bodyParser.json());

console.log('imooc started on port ' + port);


// index page
app.get('/', function(req, res) {
	res.render('index', {
		title: 'imooc 首页',
		movies: [{
			title: '机械战警',
			_id: 1,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title: '机械战警',
			_id: 2,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title: '机械战警',
			_id: 3,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title: '机械战警',
			_id: 4,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title: '机械战警',
			_id: 5,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title: '机械战警',
			_id: 6,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		}]
	});
});

// detail page
app.get('/movie/:id', function(req, res) {
	res.render('detail', {
		title: 'imooc 详情页',
		movie: {
			doctor: '何塞.帕迪里亚',
			country: '美国',
			title: '机械战警',
			year: 2014,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			language: '英语',
			flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary: '《机械战警》（2014）是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。'
		}
	});
});

// list page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			doctor: '',
			country: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	});
});

// admin page
app.get('/admin/list', function(req, res) {
	res.render('list', {
		title: 'imooc 列表页',
		movies: [{
			_id: 1,
			doctor: '何塞.帕迪里亚',
			country: '美国',
			title: '机械战警',
			year: 2014,
			language: '英语',
			flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
		}]
	});
});

var movie = new Movie({
	title: '机械战警',
	doctor: '何塞.帕迪里亚',
	year: 2014,
});

movie.save(function(err)) {
	if (err) return handleError(err);
}