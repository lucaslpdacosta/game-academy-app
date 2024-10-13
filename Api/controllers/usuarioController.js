const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Pontuacao = require('../models/Pontuacao');

const redefinirSenha = async (req, res) => {
  const { email, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: 'usuário nao existe' });
    }

    const hashedSenha = await bcrypt.hash(novaSenha, 10);

    usuario.senha = hashedSenha;
    await usuario.save();

    return res.status(200).json({ message: 'senha alterada' });
  } catch (error) {
    console.error('erro ao alterar senha:', error);
    return res.status(500).json({ message: 'erro' });
  }
};

const deletarConta = async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.destroy({ where: { id } });

    await Pontuacao.destroy({ where: { UsuarioId: id } });

  } catch (error) {
    console.error('erro ao deletar a conta', error);
    res.status(500).json({ error: 'erro' });
  }
};

const getPerfil = async (req, res) => {
  try {
    if (!Usuario) {
      return res.status(500).json({ error: 'erro no servidor' });
    }

    const user = await Usuario.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'usuário não encontrado' });
    }

    res.json({ message: 'rota protegida', userId: req.userId, userData: user });
  } catch (error) {
    console.error('erro ao obter perfil:', error);
    res.status(500).json({ error: 'erro no servidor' });
  }
};

const getAvatar = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await Usuario.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'usuario inexistente' });
    }

    const avatarId = user.avatarId;

    res.json({ avatarId });
  } catch (error) {
    console.error('erro ao obter id de avatar:', error);
    res.status(500).json({ error: 'erro:' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatarAtualId } = req.body;
    const userId = req.userId;
    
    await Usuario.update({ avatarId: avatarAtualId }, { where: { id: userId } });

    res.json({ message: 'imagem atualizada' });
  } catch (error) {
    console.error('erro ao atualizar imagem:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

const getCapa = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await Usuario.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'usuario inexistente' });
    }

    const capaId = user.capaId;

    res.json({ capaId });
  } catch (error) {
    console.error('erro ao obter id da capa:', error);
    res.status(500).json({ error: 'erro:' });
  }
};

const updateCapa = async (req, res) => {
  try {
    const { capaAtualId } = req.body;
    const userId = req.userId;
    
    await Usuario.update({ capaId: capaAtualId }, { where: { id: userId } });

    res.json({ message: 'imagem de capa atualizada' });
  } catch (error) {
    console.error('erro:', error);
    res.status(500).json({ error: 'erro:' });
  }
};

module.exports = {
  redefinirSenha,
  deletarConta,
  getPerfil,
  getAvatar,
  updateAvatar,
  getCapa,
  updateCapa
};
