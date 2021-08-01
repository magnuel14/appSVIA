'use strict';
//variables de modelos
var models = require('../models');
var Persona = models.persona;
var Entorno = models.entorno;

var idPersona = 0; //variable global para almacenar el id de la persona

class vi_frag {
    //si no hay sesion activa redirecciona a registro si es el caso si no va a la principal

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
