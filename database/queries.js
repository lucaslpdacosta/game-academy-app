const Usuario = require('../models/Usuario');

async function initDatabase() {
  try {
    const user = await Usuario.findByPk(1);
    
    if (user) {
      user.funcao = 'admin';
      await user.save();
    }
  } catch (error) {
    console.error('erro ao inicializar o banco', error);
  }
}

module.exports = {
  initDatabase,
};