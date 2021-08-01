module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
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

    Entorno.belongsTo(Persona, {
        foreignKey: 'id_persona'
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