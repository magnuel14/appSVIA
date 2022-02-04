var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutDir: __dirname + '/views/loyouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({
  secret: 'Manuel',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'modelos')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'js')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
var models = require('./models');
models.sequelize.sync().then(() => {
console.log('Base de Datos conectada');
}).catch(err => {
console.log(err, "No se conecto a la BD");
});
require('./controllers/datos/insert_rol');
require('./config/pasaporte/passport.js')(passport, models.cuenta, models.persona, models.rol);
app.use(function (req, res, next) {
  res.status(404).render('404', { titulo: "Pagina no encontrada" });
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080', 'http://192.168.1.105:8888');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
module.exports = app;
