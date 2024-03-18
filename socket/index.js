const http = require('http');
const  { Server } = require("socket.io");
const mongoose = require("mongoose")

const { PORT, MDB, LOCALHOST } = require('./config');
const chatController = require('./controller/chat');
const userController = require('./controller/user');
const { clearAllOnlineUsers } = require('./dao/online-user');


const server = http.createServer();

const io = new Server( server );


server.listen( PORT, ()=>{
    console.log(`socket on ${LOCALHOST}:${PORT}`)
    mongoose.connect( MDB.URL ).then( async ()=>{
        console.log('MDB connected!')
        await clearAllOnlineUsers()
        
        io.on( "connection", (socket)=>{
            
            chatController(socket)
            userController(socket)

        } )

    } ).catch( err=>{
        console.log('MDB connection failed!!\n', err)
    } )
} )