const Teste = require('../models/Teste');

async function criarTeste(req, res) {
    const { moduloId, conteudoId } = req.params;
    const { titulo, perguntas, respostas } = req.body;
    try {
        const novoTeste = await Teste.create({
            titulo,
            perguntas,
            respostas,
            ModuloId: moduloId,
            ConteudoId: conteudoId
        });
        res.status(201).json(novoTeste);
    } catch (error) {
        console.error('erro ao criar teste:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function getTestesByModuloIdAndConteudoId(req, res) {
    const { moduloId, conteudoId } = req.params;
    try {
        const testes = await Teste.findAll({ 
            where: { ModuloId: moduloId, ConteudoId: conteudoId } 
        });
        res.json(testes);
    } catch (error) {
        console.error('erro ao recuperar testes:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function getTesteById(req, res) {
    const { id } = req.params;
    try {
        const teste = await Teste.findByPk(id);
        if (!teste) {
            return res.status(404).json({ error: 'teste não existente' });
        }
        res.json(teste);
    } catch (error) {
        console.error('erro ao recuperar teste:', error);
        res.status(500).json({ error: 'erro' });
    }
}

module.exports = {
    criarTeste,
    getTestesByModuloIdAndConteudoId,
    getTesteById
};