module.exports = function (sequelize, Sequelize) {
    var entorno = require('../models/entorno');
    var Entorno = new entorno(sequelize, Sequelize);
    var Camara = sequelize.define('camara', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        numero: {
            type: Sequelize.INTEGER
        },
        direccionIp: {
            type: Sequelize.STRING(50)
        },
        descripcion: {
            type: Sequelize.TEXT
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },

    }, {
        freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });

    Camara.belongsTo(Entorno, {
        foreignKey: 'id_entorno'
    });
    Entorno.associate = function (models) {

        models.entorno.hasMany(models.videosse, {
            foreignKey: 'id_camara'
        });
        models.entorno.hasMany(models.fotocamara, {
            foreignKey: 'id_camara'
        });
    };


    return Camara;
};