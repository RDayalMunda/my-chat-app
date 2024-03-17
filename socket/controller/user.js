const onlineUserDao = require("../dao/online-user")

module.exports = function userController(socket){
    
    console.log('USER connected', socket.id, socket.handshake.query)
    if (socket?.handshake?.query?.userId){
        onlineUserDao.addSocket( socket.handshake.query.userId, socket.id )
    }

    socket.on("disconnect", ()=>{
        console.log('user disconnected', socket.id)
        onlineUserDao.removeSocket( socket.handshake.query.userId, socket.id )
    })
}