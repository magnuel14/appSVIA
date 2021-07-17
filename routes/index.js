var express = require('express');
var router = express.Router();
var passport = require('passport');
//cuenta
var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();
//temporal
var visucontrol= require('../controllers/vi_frag');
var visu= new visucontrol();
//usuario
var usuario =require('../controllers/personaController');
var personacontrolller = new usuario();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {title: 'Vision artificial para tu seguridad',
      fragmentos: 'Principal/inicio'});

});
//
router.get('/rcamera', visu.verCamera);


//
//funcion de autentificacion
var auth = function middleWare(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      req.flash("err_cred", "Inicia sesion !!!");
      res.redirect('/iniciar_sesion');
  }
};
//---------INICIO----------//
/**
 * Vista para iniciar Sesion
 * @section Inicio
 *  @type  get
*  @param {solicitud} req 
 *  @url /iniciar_sesion
 *  @param  {respuesta} res
 */
router.get('/login', cuentaController.verlogin);
/**
 * Vista para regsitrar usaurio
 * @section Inicio
 *  @type  get
*  @param {solicitud} req 
 *  @url /registrar
 *  @param  {respuesta} res
 */
router.get('/register', cuentaController.verRegister);
/**
 * Registro de usuario
 * @section Inicio
 *  @type  post
*  @param {solicitud} req 
 *  @url /registrar
 *  @param  {respuesta} res
 */
router.post('/registrar', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register'
}));
/**
 * Inicio de Sesión
 * @section Inicio
 *  @type  post
*  @param {solicitud} req 
 *  @url /iniciar_sesion
 *  @param  {respuesta} res
 */
router.post('/iniciar_sesion', passport.authenticate('local-signin', {
    successRedirect: '/usuario',
    failureRedirect: '/login'
}));
/**
 * Cerrar Sesión
 * @section Inicio
 *  @type  get
*  @param {solicitud} req 
 *  @url /cerrar_sesion
 *  @param  {respuesta} res
 */
router.get('/cerrar_sesion', cuentaController.cerrar);
//--------USUARIO----------//
/**
 * Vista del incio del usario
 * @section Usuario
 *  @type  get
*  @param {solicitud} req 
 *  @url /user_info
 *  @param  {respuesta} res
 */
router.get('/usuario',auth, visu.verIncioUsu);
/**
 * Vista Perfil de actualizacion
 * @section Usuario
 *  @type  get
*  @param {solicitud} req 
 *  @url /user_info
 *  @param  {respuesta} res
 */
router.get('/user_info', auth, personacontrolller.verPersona);
router.post('/user_config', auth, personacontrolller.editar);
/**
 * Actualizar foto del usuario
 * @section Usuario
 *  @type  post
*  @param {solicitud} req 
 *  @url /user_subir_imagen
 *  @param  {respuesta} res
 */
router.post('/user_subir_imagen', auth, personacontrolller.guardarFoto);


module.exports = router;
