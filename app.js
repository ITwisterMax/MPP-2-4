const express = require('express');
const mongoose = require('mongoose');

const {requireToken} = require('./controllers/auth') 

const registerAuthHandlers = require('./handlers/authHandler');
const registerPostHandlers = require('./handlers/postHandler');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: '*'}});

let clients = new Map();

mongoose.connect(
	'URL',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

io.on('connection', (socket) => {
	socket.onAny((eventName, userData) => {
		requireToken(socket, userData, () => {
			if (!clients.has(socket.id)) {
				clients.set(socket.id, socket.userId);
				socket.broadcast.emit('user:update', {userId: socket.userId, online: true});
			}
		})
	})

	registerAuthHandlers(io, socket, clients);
	registerPostHandlers(io, socket, clients);

	socket.on('disconnect', () => {
		if (clients.has(socket.id)) {
			socket.broadcast.emit('user:update', {userId: clients.get(socket.id), online: false});
			clients.delete(socket.id);
		}
	})
})

app.use(express.static(__dirname + "/public"));

http.listen(3001);
