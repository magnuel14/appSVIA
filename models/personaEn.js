
module.exports = function (sequelize, Sequelize) {
    var entorno = require('../models/entorno');
    var Entorno = new entorno(sequelize, Sequelize);
    var PersonaEn = sequelize.define('personaEn', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.INTEGER
        },
        apellido: {
            type: Sequelize.STRING(50)
        },
        descripcion: {
            type: Sequelize.TEXT
        },
        foto1: {
            type: Sequelize.STRING(100)
        },
        foto2: {
            type: Sequelize.STRING(100)
        },
        foto3: {
            type: Sequelize.STRING(100)
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });

    PersonaEn.belongsTo(Entorno, {
        foreignKey: 'id_entorno'
    });

    return PersonaEn;
};