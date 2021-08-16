var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//For Handlebars
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutDir: __dirname + '/views/loyouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//end config of Handlebars
//sesion
app.use(session({
  secret: 'Manuel',
  resave: true,
  saveUninitialized: true
}));
//end session
// use connect-flash for flash messages stored in session
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

//modelos
var models = require('./models');
//models.sequelize.sync().then(() => {
//console.log('Base de Datos conectada');
//}).catch(err => {
//console.log(err, "No se conecto a la BD");
//});
// fin de modelos

//insert
require('./controllers/datos/insert_rol');
//fin de insert

//load passport strategies
require('./config/pasaporte/passport.js')(passport, models.cuenta, models.persona, models.rol);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render('404', { titulo: "Pagina no encontrada" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
