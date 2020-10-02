const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
const listaDeUsuarios = require('./usuarios.json');
const listaDeMensagens = require('./mensagens.json');

let usuario = null;
socket.on('connect', ()=>{
  usuario = process.argv[2];

  for(let msg of listaDeMensagens){
    let usuarioDaMensagem = listaDeUsuarios.find(u => u.id == msg.usuario);
    let usuarioLogado = listaDeUsuarios.find(u => u.nome = usuario);
    
    if(usuarioDaMensagem.grupo == usuarioLogado.grupo){
      console.log(chalk.white(`${usuarioDaMensagem.nome} > ${msg.texto}`));
    }
  }

  console.log(chalk.red(`usuario ${usuario} acabou de entrar`));

  socket.emit('user_entry_notification', {
    usuario
  });
});

socket.on('message', (event)=>{
  const {mensagem, usuario} = event

  console.log(chalk.green(`${usuario} > ${mensagem}`));
});

socket.on('user_entry_notification', (event)=>{
  console.log(chalk.red(event));
});

repl.start({
  prompt: '',
  eval: (mensagem) => {
    // console.log(`voce digitou ${mensagem}`)
    socket.send({
      mensagem,
      usuario
    });

    socket.emit('custom_handler', {
      handler: 'custom_handler',
      mensagem: 'log para a mensagem ' + mensagem,
      usuario
    });
  }
});