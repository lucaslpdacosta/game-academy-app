const Usuario = require('../models/Usuario');

const usuarioAdmin = async (req, res, next) => {
    const userId = 1;

    try {
        const user = await Usuario.findByPk(userId);
        if (user && user.funcao !== 'admin') {
            user.funcao = 'admin';
            await user.save();
        }
    } catch (error) {
        console.error('erro ao mudar de funcao:', error);
    }

    next();
};

module.exports = usuarioAdmin;