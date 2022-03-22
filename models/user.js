const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
  name: String,
  login: String,
  password: String
});

module.exports = new mongoose.model('User', userScheme);