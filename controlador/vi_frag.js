'use strict';

class vi_frag {
    //si no hay sesion activa redirecciona a registro si es el caso si no va a la principal
    
    verAbout(req, res) {
        res.render('index', {
            title: 'Acerca de Area 51',
            fragmentos: "comple/about"

        });

    }
    verServicios(req, res) {
        res.render('index', {
            title: 'Servicios de Area 51',
            fragmentos: "comple/portfolio"

        });

    }
    verBlogsD(req, res) {
        res.render('index', {
            title: 'BlogsD de Area 51',
            fragmentos: "comple/blog-details"

        });

    }
    verBlog(req, res) {
        res.render('index', {
            title: 'Blogs de Area 51',
            fragmentos: "comple/blog"

        });

    }
    vercontact(req, res) {
        res.render('index', {
            title: 'Contactos de Area 51',
            fragmentos: "comple/contact"

        });

    }

}
module.exports = vi_frag;
