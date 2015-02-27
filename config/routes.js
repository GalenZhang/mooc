var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app) {
	// pre handle user
	app.use(function(req, res, next) {
		var _user = req.session.user;
		app.locals.user = _user;
		next();
	});	

	// index page
	app.get('/', Index.index);

	// signup
	app.post('/user/signup', User.signup);

	// signin
	app.post('/user/signin', User.signin);

	// show signin
	app.get('/signin', User.showSignin);

	// show signup
	app.get('/signup', User.showSignup);

	// logout
	app.get('/logout', User.logout);

	// userlist page
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);


	// detail page
	app.get('/movie/:id', Movie.detail);

	// admin new page
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);

	// admin update movie
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);

	// admin post movie
	app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);

	// list page
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);

	// list delete movie
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

	// user post comment
	app.post('/user/comment', User.signinRequired, Comment.save);

	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

	// results
	app.get('/results', Index.search);
}

