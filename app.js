var express = require('express');
var path = require('path');
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

require('./config/routes')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment'); // 引入本地变量，在jade 模板中使用
app.listen(port);

console.log('imooc started on port ' + port);

