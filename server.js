const express = require('express');
const path = require('path');

const app = express();

// informar web socket: definindo protocolo http
const server = require('http').createServer(app);
//informar protocolo wss para o web socket
const io = require('socket.io')(server);

// definindo as views
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

// simula banco de dados
let messages = [];

// definir forma de conexão com web socket
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    // mantém as mensagens em tela ao recarregar a pagina
    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);

        //enviar mensagem para todos os sockets que estão conectados no app
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3434);