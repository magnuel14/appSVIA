
module.exports = function (sequelize, Sequelize) {
    var camara = require('../models/camara');
    var Camara = new camara(sequelize, Sequelize);
    var Videosse = sequelize.define('videosse', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fechavideo: {
            type: Sequelize.INTEGER
        },
        video: {
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

    Videosse.belongsTo(Camara, {
        foreignKey: 'id_camara'
    });

    return Videosse;
};