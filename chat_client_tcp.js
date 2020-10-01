const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');

let usuario = null;
socket.on('connect', ()=>{
  usuario = process.argv[2];
  console.log(chalk.red(`usuario ${usuario} acabou de entrar`));
});

socket.on('message', (event)=>{
  const {mensagem, usuario} = event
  console.log(chalk.green(`${usuario} > ${mensagem}`));
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