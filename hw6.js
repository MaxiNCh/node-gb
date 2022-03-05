const io = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');

let clients = {}


const app = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(__dirname, './index.html');

    const readStream = fs.createReadStream(filePath, 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html' });

    readStream.pipe(res);
  }
})

const socket = io(app);

socket.on('connection', (socket) => {
  console.log('new connection');

  const clientId = socket.client.id;

  socket.emit('client-id', {clientId});
  socket.broadcast.emit('new-client');

  clients[clientId] = {name: ''};

  socket.on('chat-message', (data) => {
    if (data.userName) {
      clients[clientId].name = data.userName;
    }
    const receivedMsg = data.msg;

    socket.emit('server-message', {msg: receivedMsg, userName: clients[clientId].name, clientId});
    socket.broadcast.emit('server-message', {msg: receivedMsg, userName: clients[clientId].name, clientId});
  })
})


app.listen(3000, 'localhost');

console.log('Server is running...');