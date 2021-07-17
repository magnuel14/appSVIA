module.exports = function (sequelize, Sequelize) {
    var rol = require('../models/rol');
    var Rol = new rol(sequelize, Sequelize);
    var Persona = sequelize.define('persona', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        apellido: {
            type: Sequelize.STRING(50)
        },
        cedula: {
            type: Sequelize.STRING(10)
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        direccion: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING(15)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        foto: {
            type: Sequelize.STRING(100)
        }

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    Persona.belongsTo(Rol, {
        foreignKey: 'id_rol'
    });
    Persona.associate = function (models) {
        models.persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona'});
    };
   
    return Persona;
};