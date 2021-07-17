'use strict';

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
        res.render('index', {
            title: 'Incio de usario',
            fragmentos: "usuario/inicioUsuario"
        });

    }
}
module.exports = vi_frag;
