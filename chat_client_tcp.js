const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
const listaDeUsuarios = require('./usuarios.json');
const listaDeMensagens = require('./mensagens.json');

let usuario = null;
let usuarioLogado = null;
socket.on('connect', ()=>{
  usuario = process.argv[2];

  usuarioLogado = listaDeUsuarios.find(u => u.nome == usuario);
  for(let msg of listaDeMensagens){
    let usuarioDaMensagem = listaDeUsuarios.find(u => u.id == msg.usuario);
    
    if(usuarioDaMensagem.grupo == usuarioLogado.grupo){
      console.log(chalk.white(`${usuarioDaMensagem.nome} > ${msg.texto}`));
    }
  }

  socket.emit('agupar_usuario', {
    grupo: usuarioLogado.grupo
  });

  console.log(chalk.red(`usuario ${usuario} acabou de entrar`));

  socket.emit('user_entry_notification', {
    usuario,
    grupo: usuarioLogado.grupo
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
      usuario,
      grupo:  usuarioLogado.grupo
    });

    // socket.emit('custom_handler', {
    //   handler: 'custom_handler',
    //   mensagem: 'log para a mensagem ' + mensagem,
    //   usuario
    // });
  }
});