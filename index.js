require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database/config');
const { initDatabase } = require('./database/queries');

const autenticacao = require('./middleware/auth');

const { cadastro, login, refresh } = require('./controllers/authController');
const usuarioController = require('./controllers/usuarioController');
const moduloController = require('./controllers/moduloController');
const conteudoController = require('./controllers/conteudoController');
const testeController = require('./controllers/testeController');
const pontuacaoController = require('./controllers/pontuacaoController');
const usuarioAdmin = require('./middleware/admin')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(usuarioAdmin);

app.post('/cadastro', cadastro);
app.post('/login', login);
app.post('/refresh', refresh);

app.put('/redefinir-senha', usuarioController.redefinirSenha);
app.delete('/usuarios/:id', usuarioController.deletarConta);

app.post('/modulos', moduloController.criarModulo);
app.get('/modulos', moduloController.getModulos);
app.get('/modulos/:id', autenticacao, moduloController.getModuloById);
app.delete('/modulo/:id', moduloController.deletarModulo);

app.post('/conteudos', conteudoController.criarConteudo);
app.get('/conteudos/modulo/:moduloId', autenticacao, conteudoController.getConteudosByModuloId);
app.get('/conteudos/:id', autenticacao, conteudoController.getConteudoById);

app.post('/testes/:moduloId/:conteudoId', testeController.criarTeste);
app.get('/testes/:moduloId/:conteudoId', testeController.getTestesByModuloIdAndConteudoId);
app.get('/teste/:id', testeController.getTesteById);

app.get('/pontuacoes/usuario/:UsuarioId', pontuacaoController.getPontuacaoUsuario);
app.get('/pontuacoes/modulo/:ModuloId/usuario/:UsuarioId', autenticacao, pontuacaoController.getPontuacaoUsuarioByModuloId);
app.post('/pontuacoes/:UsuarioId/:ModuloId/:ConteudoId', autenticacao, pontuacaoController.adicionarPontuacao);

app.get('/perfil', autenticacao, usuarioController.getPerfil);
app.get('/avatar', autenticacao, usuarioController.getAvatar);
app.put('/update-avatar', autenticacao, usuarioController.updateAvatar);
app.get('/capa', autenticacao, usuarioController.getCapa);
app.put('/update-capa', autenticacao, usuarioController.updateCapa);

initDatabase()
  .then(() => {
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('erro:', error);
  });