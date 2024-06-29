const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const Usuario = require('./Usuario');
const Conteudo = require('./Conteudo');
const Modulo = require('./Modulo');

const Pontuacao = sequelize.define('Pontuacao', {
  valor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: false,
});

Pontuacao.belongsTo(Usuario);
Pontuacao.belongsTo(Modulo);
Pontuacao.belongsTo(Conteudo);

module.exports = Pontuacao;
