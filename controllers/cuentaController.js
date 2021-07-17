'use strict';
//variables de modelos
var models = require('../models');
var Cuenta = models.cuenta;
//fin de variables de modelos
class cuentaController {
    //mostrar vista de inicio de sesion
    verlogin(req, res) {
        res.render('index', {
            title: 'Hola otra vez!',
            fragmentos: "comple/login",
            error: req.flash("err_cred"),
            info:req.flash("crear")
        });

    }
    //mostar vistas de registro de persona
    verRegister(req, res) {
        res.render('index', {
            title: 'Bienvenido :)',
            fragmentos: "comple/register",
            error: req.flash("error_correo"),
           
        });

    }
    //metodo para guardar token
    guardarToken(req, res) {
        var token = req.params.token;
        Cuenta.update({
            token: token
        }, { where: { external_id: req.user.id_cuenta } }).then(function (updatedToken, created) {
            if (updatedToken) {
                console.log(updatedToken);
            }
        });
    }
    //metodo para obtener token de todas las cuentas
    obtenerToken(req, res) {
        Cuenta.findAll({}).then(function (cuenta) {
            res.status(200).json(cuenta);
        });
    }
    //metodo para cerrar session
    cerrar(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = cuentaController;