'use strict';
//variables de modelos
var models = require('../models');
var Persona = models.persona;
var Entorno = models.entorno;
//variablesgolbales
var Entorno_id = '';//variable para almacenar el id del entorno a guardar
var idPersona = 0; //variable global para almacenar el id de la persona
class entornoController {

    /*------------Guardar Entorno-----------------*/
    guardarEntorno(req, res) {
        var nombre = req.body.nombre;
        var direccion = req.body.direccion;
        Persona.findOne({ where: { external_id: req.user.id_persona } }).then(function (persona) {
            Entorno.create({
                nombre: nombre,
                direccion: direccion,
                id_persona: persona.id,

            }).then(function (newEntorno, created) {
                if (Entorno) {
                    Entorno_id = newEntorno.id;
                    res.redirect("/usuario");
                }
            });
        });
    }
    /*------------ Editar  Entorno -----------------*/
    /**
        * Este metodo me permite editar el nombrey direccion
        * a un entorno
        */
    editarEntorno(req, res) {
        var nombre = req.body.nombre;
        var direccion = req.body.direccion;
        var external = req.body.external;
        Entorno.findOne({ where: { external_id: external } }).then(function (data) {
            data.nombre = nombre;
            data.direccion = direccion,
                data.save().then(function (ok) {
                    req.flash('success', 'Se ha modificado el entorno!');
                    res.redirect('/usuario');
                });
        }).error(function (error) {
            req.flash('error', 'Hubo un problema!');
            res.redirect('/usuario');
        });
    }

    /*------------  visualizar Entorno editar-----------------*/
    /**
        * Este metodo me permite conocer los entornos
        * Al hacer la consulta retorna un json
        * @param {type} req
        * @param {type} res
        * @returns {undefined}
        */
    cargarEntornoseditar(req, res) {
        var external = req.params.external;
        Entorno.findOne({ where: { external_id: external } }).then(function (dataEn) {
            var id_per = dataEn.id_persona;

            Persona.findOne({
                where: { id: id_per }
            }).then(function (persona) {
                res.render('index', {
                    title: 'Moifica tu entorno',
                    fragmentos: "entorno/fr_modificar_entorno",
                    entoNom: dataEn.nombre,
                    entoDire: dataEn.direccion,
                    entoEcter: dataEn.external_id,
                    nombre: req.user.nombre,
                    idp: req.user.id,
                    foto: persona.foto,
                    nomEntor: dataEn.nombre,
                    externalID: dataEn.external_id,

                });
            });

        });
    }
    /*------------  visualizar Entorno incio usuario-----------------*/
    /**
        * Este metodo me permite conocer los entornos
        * Al hacer la consulta retorna un json
        * @param {type} req
        * @param {type} res
        * @returns {undefined}
        */
    cargarEntornos(req, res) {
        var idpersona = req.query.id;
        Entorno.findAll({
            where: { id_persona: idpersona }
        }).then(function (data) {

            res.json(data);
        });
    }
    /*------------ Eliminar entorno-----------------*/
    /**
        * Este metodo me permite conocer los entornos
        * Al hacer la consulta retorna un json
        * @param {type} req
        * @param {type} res
        * @returns {undefined}
        */
    eliminarEntorno(req, res) {
        var external = req.params.external;
        Entorno.destroy({ where: { external_id: external } }).then(function (dt) {
            res.redirect("/usuario");

        })
    }
    visuEntorno(req, res) {
        var external = req.params.external;
        var idpersona = req.query.id;
        Entorno.findOne({
            where: { external_id: external }
        }).then(function (data) {
            var id_per = data.id_persona;
            Persona.findOne({
                where: { id: id_per }
            }).then(function (persona) {
                res.render('index', {
                    title: 'Tu entorno',
                    fragmentos: "entorno/entornoIn",
                    entoEcter: data.external_id,
                    nombre: req.user.nombre,
                    idp: req.user.id,
                    foto: persona.foto,
                    nomEntor: data.nombre,
                    externalID: data.external_id,
                    enID: data.id,
                    error: req.flash('error'),
                    info: req.flash('info')

                });
            });
        });
    }

}
module.exports = entornoController;

