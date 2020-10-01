const http = require('http').createServer();
const io = require('socket.io')(http)

http.listen(3000, () => { console.log('estou ouvindo') });

io.on('connection', (socket)=>{
  console.log('cliente conectado', socket.id);

  socket.on('message', (event)=>{
    console.log(event);
    socket.broadcast.emit('message', event);
  });

  socket.on('disconnect', ()=>{
    console.log('cliente desconectado', socket.id)
  });

  socket.on('custom_handler', (event)=>{
    console.log(event);
  });

});