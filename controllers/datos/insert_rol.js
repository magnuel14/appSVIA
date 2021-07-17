var models = require('../../models');
var Rol = models.rol;
    var insert_rol = function (){
        Rol.findOrCreate({where: {nombre: 'usuario'}, defaults: {id: '1', job: 'usuario'}}).spread((user, created) => {
            console.log(user.get({
                plain: true
            }));
        });
    };
module.exports = insert_rol();