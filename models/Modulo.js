const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Modulo = sequelize.define('Modulo', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meta: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Modulo;