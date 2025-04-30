const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

async function cadastro(req, res) {
  try {
    const { nome, email, senha, dataNascimento, genero, localizacao } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      dataNascimento,
      genero,
      localizacao,
    });

    const token = jwt.sign({ userId: usuario.id }, SECRET_KEY);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'credenciais invalidas' });
    }

    const senhaMatch = await bcrypt.compare(senha, usuario.senha);

    if (!senhaMatch) {
      return res.status(401).json({ error: 'credenciais invalidas' });
    }

    const token = jwt.sign({ userId: usuario.id }, SECRET_KEY);
    const refreshToken = jwt.sign({ userId: usuario.id }, REFRESH_SECRET_KEY);

    res.json({ token, refreshToken });
  } catch (error) {
    console.error('erro:', error);
    res.status(500).json({ error: 'erro no servidor' });
  }
}
/*
async function atualizarAvatar(req, res) {
  try {
    const { avatarId } = req.body;
    const userId = req.userId;

    await Usuario.update({ avatarId }, { where: { id: userId } });

    res.json({ success: true, message: 'avatar atualizado com sucesso' });
  } catch (error) {
    console.error('erro:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}
*/
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'refresh token inexistente' });
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'refresh token invalido' });
      }

      const usuario = await Usuario.findByPk(decoded.userId);

      if (!usuario) {
        return res.status(401).json({ error: 'usuario inexistente' });
      }

      const newAccessToken = jwt.sign({ userId: usuario.id }, SECRET_KEY);

      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('erro:', error);
    return res.status(500).json({ error: 'erro no servidor' });
  }
}


module.exports = {
  cadastro,
  login,
  //atualizarAvatar,
  refresh
};