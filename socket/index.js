const http = require('http');
const  { Server } = require("socket.io");
const mongoose = require("mongoose")

const { PORT, MDB } = require('./config');
const chatController = require('./controller/chat');
const userController = require('./controller/user');


const server = http.createServer();

const io = new Server( server );

io.on( "connection", (socket)=>{
    
    chatController(socket)
    userController(socket)

} )

server.listen( PORT, ()=>{
    console.log(`socket on http://localhost:${PORT}`)
    mongoose.connect( MDB.URL ).then( ()=>{
        console.log('MDB connected!')
    } ).catch( err=>{
        console.log('MDB connection failed!!\n', err)
    } )
} )