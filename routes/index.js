var express = require('express');
//solo para vizulizar fragmentos
var visucontrol= require('../controlador/vi_frag');
var visu= new visucontrol();
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {title: 'Vision artificial para tu seguridad',
      fragmentos: 'Principal/inicio'});

});
//direccionamiento para los fragmentos
// el direccionamiento cuena e 3 partes
//segun la peticion sera get o post, este caso solo queremos ver un fragmentoasi que va get
//  /Direccion, hace referencia a como se nombra al link 
// visu.visu.verFragmento, se llama a la varibale antes creada y 
//se le asigna el nombre de la funcion ver fragmento, este debe esxitir en la clase instanciada
//router.get('/Direccion', visu.verFragmento);
router.get('/usuario', visu.verUsu);
router.get('/login', visu.verlogin);
router.get('/register', visu.verRegister);
router.get('/rcamera', visu.verCamera);



module.exports = router;
