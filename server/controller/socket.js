const io = require('socket.io-client');
const { LOCALHOST, CLIENT_PORT } = require('../config');

const socket = io(`${LOCALHOST}:${CLIENT_PORT}`)
socket.on("connect", ()=>{ console.log ("connected to socket") })
socket.on("disconnect", ()=>{ console.log ("disconnected from socket") })


module.exports = socket