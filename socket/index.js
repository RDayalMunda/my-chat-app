const http = require('http');
const  { Server } = require("socket.io");
const { PORT } = require('./config');
const chatController = require('./controller/chat');
const userController = require('./controller/user');


const server = http.createServer();

const io = new Server( server );

io.on( "connection", (socket)=>{
    console.log('user connected', socket.id, socket.handshake.query)
    
    
    socket.on("disconnect", ()=>{
        console.log('user disconnected', socket.id)
    })

    
    chatController(socket)
    userController(socket)

} )

server.listen( PORT, ()=>{
    console.log(`socket on http://localhost:${PORT}`)
} )