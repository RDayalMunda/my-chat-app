const groupDao = require("../dao/group")
const { getAllSocketByUserId } = require("../dao/online-user")

module.exports = function chatController(socket){
    socket.on( "send-message", async (data)=>{
        try{
            let groupData = await groupDao.getGroupDataById(data.groupId)
            console.log('participants', groupData.participants)
            if (groupData?.participants?.length){
                groupData.participants.forEach( async (userId, u) => {
                    let sockets = await getAllSocketByUserId(userId)
                    sockets.forEach( socketObj => {
                        console.log('emiting to', socketObj.socketId)
                        socket.to( socketObj.socketId ).emit("send-message", data)
                    } )
                } )
            }
        }catch(err){ console.log(err) }
    } )
}