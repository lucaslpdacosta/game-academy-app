const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

function autenticacao(req, res, next) {
  const autenticar = req.header('Authorization');

  if (!autenticar) {
    return res.status(401).json({ error: 'token inexistente' });
  }

  const token = autenticar.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'token inválido' });
  }
}

module.exports = autenticacao;