const Pontuacao = require('../models/Pontuacao');

async function getPontuacaoUsuario(req, res) {
    const { UsuarioId } = req.params;

    try {
        const pontuacoes = await Pontuacao.findAll({
            where: { UsuarioId },
            attributes: ['ConteudoId', 'valor']
        });

        res.json(pontuacoes);
    } catch (error) {
        console.error('erro ao recuperar pontuações', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function getPontuacaoUsuarioByModuloId(req, res) {
    const { ModuloId, UsuarioId } = req.params;

    try {
        const pontuacoes = await Pontuacao.findAll({
            where: { ModuloId, UsuarioId },
            attributes: ['ConteudoId', 'valor']
        });

        res.json(pontuacoes);
    } catch (error) {
        console.error('erro ao recuperar valor:', error);
        res.status(500).json({ error: 'erro' });
    }
}

async function adicionarPontuacao(req, res) {
    const { UsuarioId, ConteudoId, ModuloId } = req.params;
    const { valor } = req.body;

    try {
        let pontuacaoExistente = await Pontuacao.findOne({
            where: { UsuarioId, ConteudoId, ModuloId }
        });

        if (pontuacaoExistente) {
            pontuacaoExistente.valor = valor;
            await pontuacaoExistente.save();
            res.json({ message: 'valor atualizado' });
        } else {
            await Pontuacao.create({ UsuarioId, ModuloId, ConteudoId, valor  });
            res.json({ message: 'valor atualizado' });
        }
    } catch (error) {
        console.error('erro ao adicionar pontuação:', error);
        res.status(500).json({ error: 'erro' });
    }
}

module.exports = {
    getPontuacaoUsuario,
    getPontuacaoUsuarioByModuloId,
    adicionarPontuacao
};