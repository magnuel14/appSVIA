module.exports = function (sequelize, Sequelize) {
    var cuenta = require('../models/cuenta');
    var Cuenta = new cuenta(sequelize, Sequelize);
    var Entorno = sequelize.define('entorno', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        direccion: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }

    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });

    Entorno.belongsTo(Cuenta, {
        foreignKey: 'id_cuenta'
    });
    Entorno.associate = function (models) {

        models.entorno.hasMany(models.camara, {
            foreignKey: 'id_entorno'
        });
        models.entorno.hasMany(models.personaEn, {
            foreignKey: 'id_entorno'
        });
    };

    return Entorno;
};