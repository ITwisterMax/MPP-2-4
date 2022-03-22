const mongoose = require('mongoose');

const postScheme = new mongoose.Schema({
	author: {type: mongoose.Schema.ObjectId, ref: 'User'},
	description: {type: String, default: ''},
	date: Date,
	image: {type: String, default: ''},
});

module.exports = new mongoose.model('Post', postScheme); 