const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localizacao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  capaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  funcao: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  timestamps: false,
});

module.exports = Usuario;