const { format } = require('date-fns');
let {
  contas,
  saques,
  depositos,
  transferencias,
} = require('../dados/bancodedados');

const depositar = (req, res) => {
  const { numeroConta, valor } = req.body;

  if (!numeroConta || !valor) {
    return res.status(400).json({
      mensagem: 'Valor e/ou número da conta não preenchidos corretamente.',
    });
  }

  const contaDeposito = contas.find((conta) => conta.numero == numeroConta);

  if (!contaDeposito) {
    return res.status(404).json({ mensagem: 'Conta não encontrada.' });
  } if (!valor > 0) {
    return res.status(400).json({ mensagem: 'Favor, inserir valor válido.' });
  }

  contaDeposito.saldo += valor;

  const registrar = {
    data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    numeroConta,
    valor,
  };

  depositos.push(registrar);

  return res.status(200).send();
};

const sacar = (req, res) => {
  const { numeroConta, valor, senha } = req.body;

  if (!numeroConta || !valor || !senha) {
    return res.status(400).json({
      mensagem: 'Valor, conta e/ou senha não foram preenchidos corretamente.',
    });
  }

  const contaSaque = contas.find((conta) => conta.numero == numeroConta);

  if (!contaSaque) {
    return res
      .status(404)
      .json({ mensagem: 'Conta inexistente, verifique os dados.' });
  } if (senha !== contaSaque.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta.' });
  } if (valor > contaSaque.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente.' });
  }

  contaSaque.saldo -= valor;

  const registrarSaque = {
    data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    numeroConta,
    valor,
  };

  saques.push(registrarSaque);

  return res.status(200).send();
};

const transferir = (req, res) => {
  const {
    numeroContaOrigem, valor, senha, numeroContaDestino,
  } = req.body;

  if (!numeroContaOrigem || !valor || !senha || !numeroContaDestino) {
    return res.status(400).json({
      mensagem: 'Dados não foram preenchidos corretamente. Favor, corrigir.',
    });
  }

  const remetente = contas.find((conta) => conta.numero == numeroContaOrigem);

  const destinatario = contas.find((conta) => conta.numero == numeroContaDestino);

  if (!remetente || !destinatario) {
    return res
      .status(404)
      .json({ mensagem: 'Conta inexistente, verifique os dados.' });
  } if (senha !== remetente.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta.' });
  } if (valor > remetente.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente.' });
  }

  remetente.saldo -= valor;
  destinatario.saldo += valor;

  const regTransf = {
    data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    numeroContaOrigem,
    numeroContaDestino,
    valor,
  };

  transferencias.push(regTransf);

  return res.status(200).send();
};

module.exports = {
  depositar,
  sacar,
  transferir,
};
