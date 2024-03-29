const express = require('express')
const http = require('http');
const cors = require('cors')
const mongoose = require("mongoose")

const { PORT, MDB, LOCALHOST, CLIENT_ORIGIN } = require('./config');
const chatController = require('./controller/chat');
const userController = require('./controller/user');
const { clearAllOnlineUsers } = require('./dao/online-user');

const app = express()
app.use(cors())

const server = http.createServer(app);

const io = require("socket.io")( server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
    }
} )


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