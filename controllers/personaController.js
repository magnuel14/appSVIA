'use strict';
//variables de modelos
var models = require('../models');
var Persona = models.persona;
var Cuenta = models.cuenta;
//para desincriptar calve
var bCrypt = require('bcrypt-nodejs');
//para subir imagen
var fs = require('fs');
var maxFileSize = 1 * 1024 * 1024;
var extensiones = ["jpg", "png"];
var formidable = require('formidable');
//fin de subir archivos
class personaController {
    verPersona(req, res, next) {
        if (req.user.rol === 'usuario') {
            Persona.findOne({where: {external_id: req.user.id_persona}}).then(function (persona) {
                res.render('usuario', {titulo: req.user.nombre,
                    partial: 'partials/usuario/frm_info',
                    nombre: req.user.nombre,
                    rol: req.user.rol,
                    usuario: persona,
                    info: req.flash('info'),
                    error: req.flash('error')
                });
            });
        } 
    }
    //metodo para editar informacion del usario y administrador
    editar(req, res) {
        var isValidPassword = function (user_pass, clave) {
            return bCrypt.compareSync(clave, user_pass);
        };
        var generateHash = function (password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        Cuenta.findOne({where: {external_id: req.user.id_cuenta}}).then(function (cuenta) {
            if (isValidPassword(cuenta.clave, req.body.clave)) {
                Persona.update({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    direccion: req.body.direccion,
                    email: req.body.email,
                    telefono: req.body.fono
                }, {where: {external_id: req.user.id_persona}}).then(function (updatePersona, created) {
                    if (updatePersona) {
                        if (req.body.external_cuenta !== "0") {
                            var nueva_clave = generateHash(req.body.nueva_clave);
                            Cuenta.update({
                                clave: nueva_clave
                            }, {where: {external_id: req.user.id_cuenta}}).then(function (updateCuenta, created) {
                                if (updateCuenta) {
                                    console.log('info', 'Se ha modificado cuenta');
                                }
                            });
                        }
                        req.flash('info', 'Se ha modificado correctamente');
                    }
                });
            } else {
                req.flash('error', 'Clave incorrecta');
            }
            res.redirect('/user_info');
        });
    }
//metodo para guardar foto de usuario y administardor
guardarFoto(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (files.archivo.size <= maxFileSize) {
            var extension = files.archivo.name.split(".").pop().toLowerCase();
            if (extensiones.includes(extension)) {
                var nombre = fields.external_foto + "." + extension;
                fs.rename(files.archivo.path, "public/images/personaPerfil/" + nombre, function (err) {
                    if (err)
                        next(err);
                    Persona.update({
                        foto: nombre
                    }, {where: {external_id: fields.external_foto}}).then(function (updatedVino) {
                        if (updatedVino) {
                            req.flash('info', 'Se ha modificado foto');
                            res.redirect('/user_info');
                        }
                    });
                });
            } else {
                personaController.eliminar(files.archivo.path);
                req.flash('error', 'Error de extension');
                res.redirect('/user_info');
            }
        } else {
            personaController.eliminar(files.archivo.path);
            req.flash('error', 'Tanaño maximo 1M');
            res.redirect('/user_info');
        }
    });
}
    //metodo para elimianr imagen en el caso que no cumpla los requisitos preliminares
    static eliminar(link) {
        fs.exists(link, function (exists) {
            if (exists) {
                console.log('Eliminando archivos existentes');
                fs.unlinkSync(link);
            } else {
                console.log('No se pudo borrar ' + link);
            }
        });
    }
}

module.exports = personaController;
