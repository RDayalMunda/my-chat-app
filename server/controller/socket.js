const io = require('socket.io-client');
const { SOCKET_URL } = require('../config');

const socket = io(SOCKET_URL)
socket.on("connect", ()=>{ console.log ("connected to socket") })
socket.on("disconnect", ()=>{ console.log ("disconnected from socket") })


module.exports = socket