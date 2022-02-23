let { banco, contas, qtdUsuarios } = require('../dados/bancodedados');

const getContas = (req, res) => {
  const { senhaBanco } = req.query;

  if (senhaBanco !== banco.senha || !senhaBanco) {
    return res
      .status(400)
      .json({ mensagem: 'A senha do banco informada é inválida.' });
  } if (senhaBanco === banco.senha) {
    return res.status(200).json(contas);
  }
};

const abrirConta = (req, res) => {
  const {
    nome, email, cpf, dataNascimento, telefone, senha,
  } = req.body;

  if (!nome || !email || !cpf || !dataNascimento || !telefone || !senha) {
    return res.status(400).json({
      mensagem: 'Todos os campos precisam ser preenchidos corretamente.',
    });
  }

  const verificarEmail = contas.find((verificar) => verificar.usuario.email === email);

  const verificarCpf = contas.find((verificar) => verificar.usuario.cpf === cpf);

  if (verificarCpf || verificarEmail) {
    return res
      .status(400)
      .json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' });
  }

  qtdUsuarios += 1;
  const contaNova = {
    numero: qtdUsuarios,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      dataNascimento,
      telefone,
      email,
      senha,
    },
  };

  contas.push(contaNova);

  return res.status(200).send();
};

const putConta = (req, res) => {
  const { numeroConta } = req.params;
  const {
    nome, email, cpf, dataNascimento, telefone, senha,
  } = req.body;

  if (!nome || !email || !cpf || !dataNascimento || !telefone || !senha) {
    return res.status(400).json({
      mensagem: 'Todos os campos precisam ser preenchidos corretamente.',
    });
  }

  const contaPut = contas.find((conta) => conta.numero == numeroConta);

  if (!contaPut) {
    return res
      .status(404)
      .json({ mensagem: 'Conta não encontrada. Verifique os dados.' });
  }

  if (contaPut.cpf === cpf && contaPut.email === email) {
    contaPut.usuario = {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      senha,
    };
  } else if (contaPut.cpf === cpf && contaPut.email !== email) {
    const verificarEmail = contas.find((verificar) => verificar.usuario.email === email);

    if (verificarEmail) {
      return res.status(400).json({
        mensagem: 'Já existe uma conta com o e-mail informado!',
      });
    }
    contaPut.usuario = {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      senha,
    };
  } else if (contaPut.cpf !== cpf && contaPut.email === email) {
    const verificarCpf = contas.find((verificar) => verificar.usuario.cpf === cpf);

    if (verificarCpf) {
      return res.status(400).json({
        mensagem: 'Já existe uma conta com o cpf informado!',
      });
    }
    contaPut.usuario = {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone,
      senha,
    };
  }

  return res.status(200).send();
};

const deleteConta = (req, res) => {
  const { numeroConta } = req.params;

  const contaDelete = contas.find(
    (conta) => conta.numero === Number(numeroConta),
  );

  if (!contaDelete) {
    return res
      .status(404)
      .json({ mensagem: 'Conta não encontrada. Verifique os dados.' });
  }

  if (contaDelete.saldo !== 0) {
    return res.status(403).json({
      mensagem: 'Conta com saldo. Por favor, zerar antes da exclusão.',
    });
  }

  const index = contas.findIndex((indexConta) => indexConta === contaDelete);

  contas.splice(index, 1);

  return res.status(204).send();
};

const getSaldo = (req, res) => {
  const { numeroConta, senha } = req.query;

  if (!numeroConta || !senha) {
    return res.status(400).json({
      mensagem:
        'Requisição realizada com dados nulos. Verificar campos obrigatórios.',
    });
  }

  const contaSaldo = contas.find((conta) => conta.numero == numeroConta);

  if (!contaSaldo) {
    return res.status(400).json({ mensagem: 'Conta bancária não encontrada.' });
  }

  if (senha !== contaSaldo.usuario.senha) {
    return res.status(400).json({ mensagem: 'Senha incorreta.' });
  }

  return res.status(200).json({ saldo: contaSaldo.saldo });
};

module.exports = {
  getContas,
  abrirConta,
  putConta,
  deleteConta,
  getSaldo,
};
