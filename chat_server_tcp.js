const http = require('http').createServer();
const io = require('socket.io')(http);

http.listen(3000, () => { console.log('estou ouvindo') });

io.on('connection', (socket)=>{
  console.log('cliente conectado', socket.id);

  socket.on('agupar_usuario', (event)=>{
    socket.join(event.grupo);
  });

  socket.on('user_entry_notification', (event)=>{
    let notification = `usuario ${event.usuario} acabou de entrar`;
    console.log(notification)
    socket.to(event.grupo).emit('user_entry_notification', notification);
  });
  
  let messages = [];
  socket.on('message', (event)=>{
    console.log(event);
    messages.push(event);
    socket.to(event.grupo).emit('message', event);
  });

  socket.on('disconnect', ()=>{
    console.log('cliente desconectado', socket.id)
  });

  // socket.on('custom_handler', (event)=>{
  //   console.log(event);
  // });

});