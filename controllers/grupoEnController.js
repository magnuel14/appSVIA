'use strict';
var models = require('../models');
var uuid = require('uuid');
var Persona = models.persona;
var GrupoEn = models.grupoEn;
var Entorno = models.entorno;
var formidable = require('formidable');
var extensiones = ["jpg", "png", "gif"];
var maxSize = 1 * 1024 * 1024;
var fs = require('fs');
var mv = require('mv');
var GrupoEn_id = '';
class grupoEnController {
    guardarGrupoEn(req, res) {
        var nombre = req.body.nombreG;
        var descripcion = req.body.descripcion;
        var external = req.body.enID;
        var fotog = req.body.foto;
        Entorno.findOne({ where: { external_id: external } }).then(function (entorno) {
            GrupoEn.create({
                nombre: nombre,
                descripcion: descripcion,
                foto: fotog,
                id_entorno: entorno.id,
            }).then(function (newGrupoEn, created) {
                if (GrupoEn) {
                    GrupoEn_id = newGrupoEn.id;
                    res.redirect("/verEntornomiau/" + external);
                }
            });
        });
    }
    cargarGrupoEn(req, res) {
        var identorno = req.query.id;
        console.log(identorno);
        GrupoEn.findAll({
            where: { id_entorno: identorno }
        }).then(function (data) {

            res.json(data);
        });
    }
    editarGrupoEn(req, res) {
        var nombre = req.body.nombreG;
        var descripcion = req.body.descripcion;
        var external1 = req.body.exterEn;
        var external = req.body.enID;
        GrupoEn.findOne({ where: { external_id: external } }).then(function (data) {
            data.nombre = nombre;
            data.descripcion = descripcion,
                data.save().then(function (ok) {
                    req.flash('success', 'Se ha modificado el grupo!');
                    res.redirect("/verEntornomiau/" + external1);
                });
        }).error(function (error) {
            req.flash('error', 'Hubo un problema!');
            res.redirect("/verEntornomiau/" + external1);
        });
    }
    cargarGrupoEneditar(req, res) {
        var external = req.params.external;
        GrupoEn.findOne({ where: { external_id: external } }).then(function (dataEn) {
            var id_ento = dataEn.id_entorno;
            Entorno.findOne({ where: { id: id_ento } }).then(function (entorno) {
                var id_per = entorno.id_persona;
                Persona.findOne({ where: { id: id_per } }).then(function (persona) {
                    res.render('index', {
                        title: 'Moifica tu entorno',
                        fragmentos: "entorno/fr_modificar_grupo",
                        nombre: req.user.nombre,
                        idp: req.user.id,
                        foto: persona.foto,
                        nomEntor: entorno.nombre,
                        externalID: entorno.external_id,
                        nombregru: dataEn.nombre,
                        descrigru: dataEn.descripcion,
                        eternalGru: dataEn.external_id,
                    });
                });
            });
        });
    }
    eliminarGrupoEn(req, res) {
        var external = req.params.external;
        var external1 = req.params.externalGrupo;
        GrupoEn.destroy({ where: { external_id: external } }).then(function (dt) {
            res.redirect("/verEntornomiau/" + external1);

        })
    }
    foto_GrupoEn(req, res) {
        var form = new formidable.IncomingForm();
        var external = req.params.externalFoto;
        var external1 = req.params.externalGrupo;
        form.parse(req, function (err, fields, files) {
            if (files.archivo.size <= maxSize) {
                console.log(files.archivo);
                var extension = files.archivo.name.split(".").pop().toLowerCase();
                if (extensiones.includes(extension)) {
                    var nombreFoto = uuid.v4() + "." + extension;
                    mv(files.archivo.path, "public/images/personasEn/" + nombreFoto,
                        function (err) {
                            if (err) {
                                console.log("ERROR");
                                req.flash('error', "Hubo un error " + err);
                                res.redirect("/verEntornomiau/" + external1);
                            } else {
                                GrupoEn.findAll({ where: { external_id: external } }).then(function (resultado) {
                                    if (resultado.length > 0) {
                                        console.log("Se Encontro Persona");
                                        var grupoEn = resultado[0];
                                        grupoEn.foto = nombreFoto;
                                        grupoEn.save().then(function (save) {
                                            console.log("Guardado");
                                            fs.exists(files.archivo.path, function (exists) {
                                                if (exists)
                                                    fs.unlinkSync(files.archivo.path);
                                            });
                                            req.flash('success', "Se ha la foto de grupo");
                                            res.redirect("/verEntornomiau/" + external1);
                                        });
                                    }
                                });
                            }
                        });
                } else {
                    console.log("ARCHIVO NO VALIDO");
                    req.flash('error', "El tipo de archivo no es valido, debe ser png, jpg, o gif");
                    res.redirect("/verEntornomiau/" + external1);
                }
            } else {
                console.log("TAMA??O SUPERA 1M");
                req.flash('error', "El tamano no puede superar 1 MB");
                res.redirect("/verEntornomiau/" + external1);
            }
        });
    }
}
module.exports = grupoEnController;
