var express = require('express');
var router = express.Router();
var passport = require('passport');
//cuenta
var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();
//temporal
var visucontrol = require('../controllers/vi_frag');
var visu = new visucontrol();
//usuario
var usuario = require('../controllers/personaController');
var personacontrolller = new usuario();
//utilidades
var utilidades = require('../controllers/utilidades');
//entorno
var entorno = require('../controllers/entornoController');
var entornoController = new entorno();
//grupo
var grupoEn = require('../controllers/grupoEnController');
var grupoEnoController = new grupoEn();
/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index', {
        title: 'Vision artificial para tu seguridad',
        fragmentos: 'Principal/inicio'
    });

});
//

//
router.get('/rcamera', visu.verCamera);


//
//funcion de autentificacion
var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();

    } else {
        req.flash("err_cred", "Inicia sesion !!!");
        res.redirect('/login');
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
    failureRedirect: '/login',
    failureFlash: true
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
router.get('/usuario', auth, visu.verIncioUsu);
/**
 * Vista Perfil de actualizacion
 * @section Usuario
 *  @type  get
*  @param {solicitud} req 
 *  @url /user_info
 *  @param  {respuesta} res
 */
router.get('/verModimiau/:external',auth,personacontrolller.VerUsuarioEditar);
/**
 * Actualizar info del usuario
 * @section Usuario
 *  @type  post
*  @param {solicitud} req 
 *  @url /user_subir_imagen
 *  @param  {respuesta} res
 */
router.post('/modificar_infoUsu',auth,personacontrolller.modificarDatos);
/**
 * Actualizar clave del usuario
 * @section Usuario
 *  @type  post
*  @param {solicitud} req 
 *  @url /user_subir_imagen
 *  @param  {respuesta} res
 */
router.post('/modificar_claUsu',auth,personacontrolller.modificarCuenta);
/**
 * Actualizar info del foto
 * @section Usuario
 *  @type  post
*  @param {solicitud} req 
 *  @url /user_subir_imagen
 *  @param  {respuesta} res
 */
router.post('/foPerfil_usu', auth, personacontrolller.foto_Perfil);
/**
 * Ver entornos
 *
 */
/**
 *Crear entorno
 * @section Entorno
 *  @type  post
 */
router.post('/crear_entorno', auth, entornoController.guardarEntorno);
/**
*Cargar entorno en la tabla de inicio
* @section Entorno
*  @type  get
*/
router.get('/cargar_entorno', auth, entornoController.cargarEntornos);
/**
*Cargar fragmento de modificar entorno
* @section Entorno
*  @type  get
*/
router.get('/cargar_entornoModi/:external', auth, entornoController.cargarEntornoseditar);
/**
*Modificar entorno
* @section Entorno
*  @type  post
*/
router.post('/modificar_entorno', auth, entornoController.editarEntorno);
/**
*Eliminar entorno
* @section Entorno
*  @type  post
*/
router.get('/eliminar_entorno/:external', auth, entornoController.eliminarEntorno);
/**
*Visualizar entorno especifico entorno
* @section Entorno
*  @type  post
*/

router.get('/verEntornomiau/:external',auth,entornoController.visuEntorno);
/**
 * Grupos entorno
 *
 */
/**
 *Crear grupo
 * @section Entorno
 *  @type  post
 */
 router.post('/crear_grupoEn',auth,grupoEnoController.guardarGrupoEn);
/**
*Cargar grupo en la tabla de entornos
* @section Grupos en
*  @type  get
*/
router.get('/cargar_grupoEn',auth, grupoEnoController.cargarGrupoEn);
/**
*Cargar fragmento de modificar grupos
* @section Entorno
*  @type  get
*/
router.get('/cargar_grupoModi/:external',auth,grupoEnoController.cargarGrupoEneditar);
/**
*Modificar entorno
* @section Entorno
*  @type  post
*/
router.post('/modificar_grupo',auth,grupoEnoController.editarGrupoEn);
/**
*Eliminar entorno
* @section Entorno
*  @type  post
*/
router.get('/eliminar_grupo/:external/:externalGrupo', auth, grupoEnoController.eliminarGrupoEn);
/**
 * Subir foto del grupo
 * @section gruposEn
 *  @type  post
*  @param {solicitud} req 
 *  @param  {respuesta} res
 */
router.post('/grupo_Foto/:externalFoto/:externalGrupo', auth, grupoEnoController.foto_GrupoEn);
module.exports = router;
