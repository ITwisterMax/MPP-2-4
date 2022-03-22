const OPEN_MODE = 0o666;
const fs = require('fs')
const crypto = require('crypto')

const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = function(userData, socket, clientsOnline) {
	let date = new Date();

	let userId = socket.userId;
	userData.filename = crypto.createHash('md5').update(userData.filename).digest('hex');
	let post = new Post({
		author: userId,
		date: date,
		description: userData.description, 
		image: userData.filename
	});

	let filename = __dirname + '/../public/assets/' + userData.filename;
	fs.open(filename, 'w', OPEN_MODE, (err, fd) => {
		if (err) {
			return;
		}

		fs.writeFile(fd, userData.filedata, () => {
			fs.close(fd);
		})
	})
	
	post.save(function(err, post) {
		if (! err) {
			showPosts(socket);
		} 
	});
}

function showPosts(socket) {
	let userId = socket.userId
	if (!userId) {
		socket.emit('posts', {err: 'Вы не авторизированы'})

		return;
	}
	
	User.findById(userId, function(err, user){
		if (err) {
			socket.emit('posts', {err: 'Пользователь не найден'});

			return;
		}

		Post.find().populate('author').sort({date: -1}).exec(
			function(err, posts) {
				if (err) {
					socket.emit('posts', {err: 'Ошибка'})
				}
				else {
					let postsToSend = posts.map( post => {
						return {
							postId: post._id,
							authorName: post.author.name,
							description: post.description,
							date: post.date,
							photo: '/assets/' + post.image,
						}
					})

					socket.emit('posts', {posts: postsToSend});
				}
			}
		);
	}); 
}

exports.showPosts = function(socket) {
  	showPosts(socket);
}