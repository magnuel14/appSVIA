var bCrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');
module.exports = function (passport, cuenta, persona, rol) {
    var Cuenta = cuenta;
    var Persona = persona;
    var Rol = rol;
    var LocalStrategy = require('passport-local').Strategy;
    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.id);
    });
    passport.deserializeUser(function (id, done) {
        Cuenta.findOne({ where: { id: id }, include: [{ model: Persona, include: { model: Rol } }] }).then(function (cuenta) {
            if (cuenta) {
                var userinfo = {
                    id: cuenta.id,
                    id_cuenta: cuenta.external_id,
                    id_persona: cuenta.persona.external_id,
                    nombre: cuenta.persona.nombre + " " + cuenta.persona.apellido,
                    rol: cuenta.persona.rol.nombre
                };
                done(null, userinfo);
            } else {
                done(cuenta.errors, null);
            }
        });
    });
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            var generateHash = function (password) {

                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            Cuenta.findOne({
                where: {
                    correo: email
                }
            }).then(function (cuenta) {
                if (cuenta) {
                    return done(null, false, {
                        message: req.flash('error_correo', 'El correo ya esta regisrado')
                    });
                } else {
                    var userPassword = generateHash(password);
                    Rol.findOne({
                        where: { nombre: 'usuario' }
                    }).then(function (rol) {
                        if (rol) {
                            var dataPersona =
                            {
                                apellido: req.body.apellidos,
                                nombre: req.body.nombres,
                                correo: req.body.correo,
                                cedula: req.body.cedula,
                                external_id: uuidv4(),
                                direccion: req.body.direccion,
                                foto: '0.jpg',
                                id_rol: rol.id,
                                estado: true
                            };
                            Persona.create(dataPersona).then(function (newPersona, created) {
                                if (!newPersona) {
                                    return done(null, false);                           
                                }
                                if (newPersona) {                                    
                                    var dataCuenta = {
                                        correo: email,
                                        clave: userPassword,
                                        estado: true,
                                        id_persona: newPersona.id,
                                        external_id: uuidv4()
                                    };
                                    Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                        if (newCuenta) {
                                            return done(null, newCuenta, {
                                                message: req.flash('crear', 'Su cuenca se ha creado')
                                            });
                                        }
                                        if (!newCuenta) {
                                            return done(null, false,{
                                                message: req.flash('error_q', 'Su cuenca no se puedo crear, revise bien si informacion no sea imbecil')
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            return done(null, false, {
                                message: 'El rol no existe'
                            });
                        }
                    });
                }
            });
        }
    ));
    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
            passReqToCallback: true
        },
        function (req, correo, clave, done) {
            var Cuenta = cuenta;
            var isValidPassword = function (userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };
            Cuenta.findOne({ where: { correo: correo } }).then(function (cuenta) {
                if (!cuenta) {
                    return done(null, false, { message: req.flash('err_cred', 'Cuenta no existe') });
                }
                if (!isValidPassword(cuenta.clave, clave)) {
                    return done(null, false, { message: req.flash('err_cred', 'Clave incorrecta') });
                }
                var userinfo = cuenta.get();
                return done(null, userinfo);
            }).catch(function (err) {
                return done(null, false, { message: req.flash('err_cred', 'Cuenta erronea') });
            });
        }
    ));

};