const onlineUserDao = require("../dao/online-user")

module.exports = function userController(socket){
    
    if (socket?.handshake?.query?.userId){
        onlineUserDao.addSocket( socket.handshake.query.userId, socket.id )
    }

    socket.on("disconnect", ()=>{
        onlineUserDao.removeSocket( socket.handshake.query.userId, socket.id )
    })
}