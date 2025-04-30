const Conteudo = require('../models/Conteudo');

async function criarConteudo(req, res) {
    const { tipo, texto, linkVideo, pontos, ModuloId } = req.body;
    if (!tipo || !pontos || !ModuloId) {
      return res.status(400).json({ error: 'dados não podem ficar vazios' });
    }
  
    try {
      const novoConteudo = await Conteudo.create({ tipo, texto, linkVideo, pontos, ModuloId });
      res.status(201).json(novoConteudo);
    } catch (error) {
      console.error('erro ao inserir conteúdo:', error);
      res.status(500).json({ error: 'erro' });
    }
  }  

async function getConteudosByModuloId(req, res) {
    const { moduloId } = req.params;
    try {
        const conteudos = await Conteudo.findAll({ where: { ModuloId: moduloId } });
        res.json(conteudos);
    } catch (error) {
        console.error('erro ao recuperar conteúdos:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function getConteudoById(req, res) {
    const { id } = req.params;
    try {
        const conteudo = await Conteudo.findByPk(id);
        if (!conteudo) {
            return res.status(404).json({ error: 'conteúdo não existente' });
        }
        res.json(conteudo);
    } catch (error) {
        console.error('Erro ao recuperar conteúdo:', error);
        res.status(500).json({ error: 'erro' });
    }
}

module.exports = {
    criarConteudo,
    getConteudosByModuloId,
    getConteudoById
};
