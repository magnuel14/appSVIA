'use strict';
var models = require('./../models/');
var uuid = require('uuid');
var bcrypt = require('bcrypt');
 function verificaEstadoSesion(req,res,next) {
    models.Cuenta.findOne({where: {estado: true}, include: [{model: models.Persona, where: {external_id: req.user.id}}]}).then(function (activo) {
        if (activo) {
            next();
        } else {
            req.flash("error", "Tu cuenta fue dada de baja");
            res.redirect('/cerrar_sesion');
        }
    });
}
module.exports = { verificaEstadoSesion};

