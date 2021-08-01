'use strict';
/**
 * Modelos de la base de datos
 */
var models = require('./../models/');
var uuid = require('uuid');
/**
 * Modulo de encriptacion de claves
 */
var bcrypt = require('bcrypt');

/**
 * Este metodo te permite verificar si un usuario fue dado de baja
 * mientras estaba en la sesion, en el caso que este dado de baja, 
 * automaticamente se le cerrara la sesion 
 * @param {type} req
 * @param {type} res
 * @param {type} next
 * @returns {undefined}
 */
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

