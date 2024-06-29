const Modulo = require('../models/Modulo');
const Conteudo = require('../models/Conteudo');
const Teste = require('../models/Teste');
const Pontuacao = require('../models/Pontuacao');

async function criarModulo(req, res) {
    const { titulo, meta } = req.body;

    try {
        const moduloExistente = await Modulo.findOne({ where: { titulo } });
        if (moduloExistente) {
            return res.status(400).json({ error: 'já existe módulo com mesmo titulo' });
        }

        const novoModulo = await Modulo.create({ titulo, meta });

        res.status(201).json(novoModulo);
    } catch (error) {
        console.error('erro ao criar o módulo:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function getModulos(req, res) {
    try {
        const modulos = await Modulo.findAll();
        res.json(modulos);
    } catch (error) {
        console.error('erro ao recuperar módulos:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function getModuloById(req, res) {
    const { id } = req.params;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ error: 'módulo não existente' });
        }
        res.json(modulo);
    } catch (error) {
        console.error('erro:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function deletarModulo(req, res) {
    const { id } = req.params;
    try {
        await Pontuacao.destroy({ where: { ModuloId: id } });
        await Modulo.destroy({ where: { id } });
        await Conteudo.destroy({ where: { ModuloId: id } });
        await Teste.destroy({ where: { ModuloId: id } });

        res.json({ message: 'módulo deletado' });
    } catch (error) {
        console.error('erro:', error);
        res.status(500).json({ error: 'erro' });
    }
}

module.exports = {
    criarModulo,
    getModulos,
    getModuloById,
    deletarModulo
};