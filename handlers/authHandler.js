const auth = require('../controllers/auth')

module.exports = (io, socket, clients) => {
  	socket.on('auth:signin', (userData) => {
		auth.signin(userData, socket);
  	})

	socket.on('auth:signup', (userData) => {
		auth.signup(userData, socket);
	})

	socket.on('auth:signout', () => {
		auth.signout(socket, clients);
	})
}