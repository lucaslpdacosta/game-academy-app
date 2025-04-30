const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const Modulo = require('./Modulo');

const Conteudo = sequelize.define('Conteudo', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkVideo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pontos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: false,
});

Conteudo.belongsTo(Modulo, { foreignKey: 'ModuloId', onDelete: 'CASCADE' });

module.exports = Conteudo;