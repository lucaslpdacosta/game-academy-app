const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const Modulo = require('./Modulo');
const Conteudo = require('./Conteudo');

const Teste = sequelize.define('Teste', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  perguntas: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  respostas: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
}, {
  timestamps: false,
});

Teste.belongsTo(Modulo, { onDelete: 'CASCADE' });
Teste.belongsTo(Conteudo);

module.exports = Teste;