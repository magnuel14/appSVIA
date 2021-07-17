module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cuenta = sequelize.define('cuenta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        correo: {
            type: Sequelize.STRING(50)
        },
        clave: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        token: {
            type: Sequelize.TEXT
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }

    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });

    Cuenta.belongsTo(Persona, {
        foreignKey: 'id_persona'
    });
    Cuenta.associate = function (models) {

        models.cuenta.hasMany(models.entorno, {
            foreignKey: 'id_cuenta'
        });
    };

    return Cuenta;
};