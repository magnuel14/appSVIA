var express = require('express');
var router = express.Router();
var passport = require('passport');
var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();
var visucontrol = require('../controllers/vi_frag');
var visu = new visucontrol();
var usuario = require('../controllers/personaController');
var personacontrolller = new usuario();
var entorno = require('../controllers/entornoController');
var entornoController = new entorno();
var grupoEn = require('../controllers/grupoEnController');
var grupoEnoController = new grupoEn();
router.get('/', function (req, res, next) {

    res.render('index', {
        title: 'Vision artificial para tu seguridad',
        fragmentos: 'Principal/inicio'
    });

});
router.get('/rcamera', visu.verCamera);
var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("err_cred", "Inicia sesion !!!");
        res.redirect('/login');
    }
};
router.get('/login', cuentaController.verlogin);
router.get('/register', cuentaController.verRegister);
router.post('/registrar', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register'
}));
router.post('/iniciar_sesion', passport.authenticate('local-signin', {
    successRedirect: '/usuario',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/cerrar_sesion', cuentaController.cerrar);
router.get('/usuario', auth, visu.verIncioUsu);
router.get('/verModimiau/:external',auth,personacontrolller.VerUsuarioEditar);
router.post('/modificar_infoUsu',auth,personacontrolller.modificarDatos);
router.post('/modificar_claUsu',auth,personacontrolller.modificarCuenta);
router.post('/foPerfil_usu', auth, personacontrolller.foto_Perfil);
router.post('/crear_entorno', auth, entornoController.guardarEntorno);
router.get('/cargar_entorno', entornoController.cargarEntornos);
router.get('/cargar_entornoModi/:external', auth, entornoController.cargarEntornoseditar);
router.post('/modificar_entorno', auth, entornoController.editarEntorno);
router.get('/eliminar_entorno/:external', auth, entornoController.eliminarEntorno);
router.get('/verEntornomiau/:external',auth,entornoController.visuEntorno);
 router.post('/crear_grupoEn',auth,grupoEnoController.guardarGrupoEn);
router.get('/cargar_grupoEn',auth, grupoEnoController.cargarGrupoEn);
router.get('/cargar_grupoModi/:external',auth,grupoEnoController.cargarGrupoEneditar);
router.post('/modificar_grupo',auth,grupoEnoController.editarGrupoEn);
router.get('/eliminar_grupo/:external/:externalGrupo', auth, grupoEnoController.eliminarGrupoEn);
router.post('/grupo_Foto/:externalFoto/:externalGrupo', auth, grupoEnoController.foto_GrupoEn);
module.exports = router;
