const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');

const roteador = express();

roteador.get('/contas', contas.getContas);
roteador.get('/contas/saldo', contas.getSaldo);
roteador.post('/contas', contas.abrirConta);
roteador.post('/transacoes/depositar', transacoes.depositar);
roteador.post('/transacoes/sacar', transacoes.sacar);
roteador.post('/transacoes/transferir', transacoes.transferir);
roteador.put('/contas/:numeroConta/usuario', contas.putConta);
roteador.delete('/contas/:numeroConta', contas.deleteConta);

module.exports = roteador;
