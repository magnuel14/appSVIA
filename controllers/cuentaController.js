'use strict';
var models = require('../models');
var Cuenta = models.cuenta;
class cuentaController {
    verlogin(req, res) {
        res.render('index', {
            title: 'Hola otra vez!',
            fragmentos: "comple/login",
            error: req.flash("err_cred"),
            info:req.flash("crear")
        });
    }
    verRegister(req, res) {
        res.render('index', {
            title: 'Bienvenido :)',
            fragmentos: "comple/register",
            error: req.flash("error_correo"),
        });
    }
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
    obtenerToken(req, res) {
        Cuenta.findAll({}).then(function (cuenta) {
            res.status(200).json(cuenta);
        });
    }
    cerrar(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}
module.exports = cuentaController;