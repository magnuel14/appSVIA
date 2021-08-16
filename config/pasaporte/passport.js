//load bcrypt
var bCrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');

module.exports = function (passport, cuenta, persona, rol) {
    var Cuenta = cuenta;
    var Persona = persona;
    var Rol = rol;
    var LocalStrategy = require('passport-local').Strategy;
    //serialize
    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.id);
    });
    // deserialize user 
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


    //registro de usuario por passport
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            //codigo para registrar el usuario
            //console.log("estoy entrando");

            var generateHash = function (password) {

                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            //verificar si el email no esta registrado
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
                          //console.log("Datos el usario:procesando");
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
                                      //console.log("No se a creado la persona: " + newPersona.id);
                                }
                                if (newPersona) {
                                      //console.log("Se ha creado la persona: " + newPersona.id);

                                    var dataCuenta = {
                                        correo: email,
                                        clave: userPassword,
                                        estado: true,
                                        id_persona: newPersona.id,
                                        external_id: uuidv4()
                                    };
                                    Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                        if (newCuenta) {
                                              //console.log("Se ha creado la cuenta: " + newCuenta.id);
                                            return done(null, newCuenta, {
                                                message: req.flash('crear', 'Su cuenca se ha creado')

                                            });
                                        }
                                        if (!newCuenta) {
                                              //console.log("cuenta no se pudo crear");
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

    //inicio de sesion
    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
            passReqToCallback: true
        },
        function (req, correo, clave, done) {
            //codigo para registrar el usuario
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
                //console.log(userinfo);
                return done(null, userinfo);

            }).catch(function (err) {
                  //console.log("Error:", err);
                return done(null, false, { message: req.flash('err_cred', 'Cuenta erronea') });
            });
        }
    ));

};