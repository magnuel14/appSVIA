'use strict';
var models = require('../models');
var Persona = models.persona;
var idPersona = 0;
class vi_frag {
    verUsu(req, res) {
        res.render('index', {
            title: 'Form',
            fragmentos: "Principal/headerU"
        });
    }
    verCamera(req, res) {
        res.render('index', {
            title: 'Tomate una foto',
            fragmentos: "usuario/rCmara"
        });
    }
    verIncioUsu(req, res) {
        Persona.findOne({
            where: { external_id: req.user.id_persona }
        }).then(function (persona) {
            idPersona = persona.id;
            res.render('index', {
                title: 'Incio de usuario',
                fragmentos: 'usuario/inicioUsuario',
                nombre: req.user.nombre,
                foto: persona.foto,
                rol: req.user.rol,
                idp: req.user.id,
                cedula: persona.cedula,
                direccion: persona.direccion,
                telefono: persona.telefono,
                external_id: persona.external_id,
                error: req.flash("error"),
                info: req.flash("success")
            })
        });
    }
}
module.exports = vi_frag;
