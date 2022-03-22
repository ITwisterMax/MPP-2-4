const post = require('../controllers/post')
const {requireToken} = require('../controllers/auth') 

module.exports = (io, socket, clients) => {
    socket.on('posts', (userData) => {
        requireToken(socket, userData, () => {
            post.showPosts(socket);
        })
    })

    socket.on('post:create', (userData) => {
        requireToken(socket, userData, () => {
            post.createPost(userData, socket, clients);
        })
    })
}