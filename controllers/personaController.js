'use strict';
//variables de modelos
var models = require('../models');
var uuid = require('uuid');
var Persona = models.persona;
var Cuenta = models.cuenta;
//para desincriptar calve
var bCrypt = require('bcrypt-nodejs');
//Subir Fto
var formidable = require('formidable');
var extensiones = ["jpg", "png", "gif"];
var maxSize = 1 * 1024 * 1024;
var fs = require('fs');
var mv = require('mv');
//fin de subir archivos
class personaController {
    VerUsuarioEditar(req, res, next) {
        var external = req.params.external;
        Persona.findOne({
            where: { external_id: external }
        }).then(function (data) {
            var idpersona = data.id;

            Cuenta.findOne({
                where: { id_persona: idpersona }
            }).then(function (cuenta) {
                res.render('index', {
                    title: 'Modifica tu informacion',
                    fragmentos: "usuario/fr_modiUsuario",
                    nombre: data.nombre,
                    foto: data.foto,
                    rol: req.user.rol,
                    idp: req.user.id,
                    nomU: data.nombre,
                    apeU: data.apellido,
                    ceduU: data.cedula,
                    direU: data.direccion,
                    teleU: data.telefono,
                    exU: data.external_id,

                    correU: cuenta.correo,
                    claveU: cuenta.clave,
                    exUC: cuenta.external_id,


                    error: req.flash('error'),
                    info: req.flash('info')
                });

            });
        });

    }
    /**
     * Metodo actualiza los datos personales del usuario que este iniciado sesion
     * @param {type} req
     * @param {type} res
     * @returns {undefined} No retorna nada
     */
    modificarDatos(req, res) {
        var external = req.body.external;

        Persona.findOne({ where: { external_id: external } }).then(function (persona) {

            persona.nombre = req.body.nombres,
                persona.apellido = req.body.apellidos,
                persona.cedula = req.body.cedula,
                persona.direccion = req.body.direccion,
                persona.telefono = req.body.telefono

            persona.save().then(function (ok) {
                console.log('Se ha modificado su informacion');
                res.redirect('/usuario');
            });
        }).error(function (error) {
            console.log('Hubo un error!');
            res.redirect('/usuario');
        });
    }

    /**
     * Metodo actualiza los datos de la cuenta del usuario que este iniciado sesion
     * @param {type} req
     * @param {type} res
     * @returns {undefined} No retorna nada
     */
    modificarCuenta(req, res) {
        var external = req.body.external_cuenta;

        if (req.body.claveNueva === req.body.claveNuevaV) {
            var generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            var nuevaClave = generateHash(req.body.claveNueva);
            Cuenta.findOne({ where: { external_id: external } }).then(function (data) {

                data.clave = nuevaClave;

                data.save().then(function (ok) {
                    req.flash('success', 'Se ha modificado su clave');
                    res.redirect('/usuario');
                });

            });
        } else {
            req.flash('error', 'No pudimos cambiar de clave debido a que las claves que ingresaste no eran iguales');
            res.redirect('/usuario');
        }


    }

    /**
     * Metodo permite guardar la imagen en la carpeta perfil 
     * Guarda el nombre de la imagen en la base de datos
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    foto_Perfil(req, res) {
        var form = new formidable.IncomingForm();
        var external = req.body.external1;

        form.parse(req, function (err, fields, files) {
            if (files.archivo.size <= maxSize) {
                console.log(files.archivo);
                var extension = files.archivo.name.split(".").pop().toLowerCase();
                if (extensiones.includes(extension)) {
                    var nombreFoto = uuid.v4() + "." + extension;
                    mv(files.archivo.path, "public/images/personaPerfil/" + nombreFoto,
                        function (err) {
                            if (err) {
                                console.log("ERROR");
                                req.flash('error', "Hubo un error " + err);
                                res.redirect("/usuario");
                            } else {
                                Persona.findAll({ where: { id: req.user.id }}).then(function (resultado) {
                                    if (resultado.length > 0) {
                                        console.log("Se Encontro Persona");
                                        var persona = resultado[0];
                                        persona.foto = nombreFoto;
                                        persona.save().then(function (save) {
                                            console.log("Guardado");
                                            fs.exists(files.archivo.path, function (exists) {
                                                if (exists)
                                                    fs.unlinkSync(files.archivo.path);
                                            });
                                            req.flash('success', "Se ha cambiado su foto de perfil");
                                            res.redirect("/usuario");
                                        });
                                    }
                                });
                            }
                        });
                } else {
                    console.log("ARCHIVO NO VALIDO");
                    req.flash('error', "El tipo de archivo no es valido, debe ser png, jpg, o gif");
                    res.redirect("/usuario");
                }
            } else {
                console.log("TAMAÑO SUPERA 1M");
                req.flash('error', "El tamano no puede superar 1 MB");
                res.redirect("/usuario");
            }
        });
    }
}
module.exports = personaController;
