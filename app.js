var express = require('express');
var path = require('path');
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user');
var mongoose = require('mongoose');
var session = require('express-session'); 
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var port = process.env.PORT || 3000;   // 从环境中取到的参数，windows 中需要使用set PORT=4000
var app = express();
var dbUrl = 'mongodb://localhost/imooc';

mongoose.connect(dbUrl);

app.set('views', './views/pages');	// 设置视图的根目录
app.set('view engine', 'jade');	// 设置默认模板引擎
app.use(bodyParser.urlencoded({ extended: true }));	// 将表单的数据格式化
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'imooc',
	resave:false,
  	saveUninitialized:false,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment'); // 引入本地变量，在jade 模板中使用
app.listen(port);

console.log('imooc started on port ' + port);

// pre handle user
app.use(function(req, res, next) {
	var _user = req.session.user;
	if (_user) {
		app.locals.user = _user;
	}

	return next();
});	

// index page
app.get('/', function(req, res) {
	// console.log('user in session:');
	// console.log(req.session.user);

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
});

// signup
app.post('/user/signup', function(req, res) {
	var  _user = req.body.user;

	User.findOne({name: _user.name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user) {
			res.redirect("/")
		} 
		else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}

				res.redirect("/admin/userlist");
			})
		}
	})
})

// signin
app.post('/user/signin', function(req, res) {
	var _user = req.body.user;
	var name = _user.name;	
	var password = _user.password;

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) {
			return res.redirect("/");
		} 

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				req.session.user = user;
				res.redirect("/");
			}
			else {
				console.log("Password is not matched");
			}
		})
	})
});

// logout
app.post('/logout', function(req, res) {
	delete req.session.user;
	delete app.locals.user;
	res.redirect('/');
});

// userlist page
app.get('/admin/userlist', function(req, res) {
	User.fetch(function (err, users) {
		if (err) {
			console.log(err);
		}

		res.render('userlist', {
			title: 'imooc 用户列表页',
			users: users
		});
	})
});


// detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'imooc ' + movie.title,
			movie: movie
		});
	});
});

// admin page
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

// admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc 后台更新页面',
				movie: movie
			});
		});
	}
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
	var movieObj = req.body.movie;
	var id = movieObj._id;
	var _movie;

	if (id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		})
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}

			res.redirect('/movie/' + movie._id);
		});
	}
});

// list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	})
});

// list delete movie
app.delete('/admin/list', function(req, res){
	var id = req.query.id;

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err);
			}
			else {
				res.json({success: 1});
			}
		});
	}
});

