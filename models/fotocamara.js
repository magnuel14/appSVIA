
module.exports = function (sequelize, Sequelize) {
    var camara = require('../models/camara');
    var Camara = new camara(sequelize, Sequelize);
    var Fotocamara = sequelize.define('fotocamara', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fechaFoto: {
            type: Sequelize.INTEGER
        },
        foto: {
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

    Fotocamara.belongsTo(Camara, {
        foreignKey: 'id_camara'
    });

    return Fotocamara;
};