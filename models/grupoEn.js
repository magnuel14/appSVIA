
module.exports = function (sequelize, Sequelize) {
    var entorno = require('./entorno');
    var Entorno = new entorno(sequelize, Sequelize);
    var GrupoEn = sequelize.define('grupoEn', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }, nombre: {
            type: Sequelize.STRING(50)
        },
        descripcion: {
            type: Sequelize.TEXT
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

    GrupoEn.belongsTo(Entorno, {
        foreignKey: 'id_entorno'
    });

    return GrupoEn;
};