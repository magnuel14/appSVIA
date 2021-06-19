'use strict';

class vi_frag {
    //si no hay sesion activa redirecciona a registro si es el caso si no va a la principal

    verUsu(req, res) {
        res.render('index', {
            title: 'Form',
            fragmentos: "Principal/headerU"

        });

    }
    verlogin(req, res) {
        res.render('index', {
            title: 'Form',
            fragmentos: "comple/login"

        });

    }
    verRegister(req, res) {
        res.render('index', {
            title: 'Form',
            fragmentos: "comple/register"

        });

    }
    verCamera(req, res) {
        res.render('index', {
            title: 'Form',
            fragmentos: "comple/rCmara"

        });

    }
}
module.exports = vi_frag;
