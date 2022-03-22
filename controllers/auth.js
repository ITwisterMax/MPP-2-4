const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signout = (socket, clientsOnline) => {
	if (clientsOnline.has(socket.id)) {
		socket.broadcast.emit('user:update', {userId: clientsOnline.get(socket.id), online: false})
		clientsOnline.delete(socket.id);
	}
}

exports.signup = (userData, socket) => {
	User.findOne({login: userData.login}, function(err, user) {
		if (err) {
			return;
		}
		
		if (user) {
			socket.emit('auth:signup', {err: 'Введите другой логин'});

			return;
		}
		
		user = new User(userData);
		user.save(function(err) {
			if (! err) {
				authorize(socket, user, 'auth:signup');
			}
		}); 
	});
}

exports.signin = (userData, socket) => {
	let {login, password} = userData;

	User.findOne({login, password}, function(err, user) {
		if (err || !user) {
			socket.emit('auth:signin', {err: 'Проверьте данные'});
		} 
		else {
			authorize(socket, user, 'auth:signin');
		}
	});
}

function authorize(socket, user, message) {
	let token = jwt.sign({userId: user._id}, '12345678');
	socket.emit(message, {token: token, userId: user._id})
}

exports.requireSignin = (request, response, next) => {
	if (request.cookies.userId) {
		next();
	} else {
		response.status(401).json({err: 'Вы не авторизированы'});
	}
}

exports.requireToken = (socket, userData, next) => {
	let token = userData?.token;
	if (token) {
		jwt.verify(token, '12345678', (err, payload) => {
			if (err) {
				socket.emit('error:401');

				return;
			}

			socket.userId = payload.userId;
			next();
		})
	}
	else {
		socket.emit('error:401');
	} 
}