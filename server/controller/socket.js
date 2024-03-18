const io = require('socket.io-client');

const socket = io("http://192.168.170.212:3081")
socket.on("connect", ()=>{ console.log ("connected to socket") })
socket.on("disconnect", ()=>{ console.log ("disconnected from socket") })


module.exports = socket