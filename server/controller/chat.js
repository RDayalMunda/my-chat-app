const chatDao = require("../dao/chat")
const { getUserByOid } = require("../dao/user.js")
const { STATUS_CODE } = require("../helper/constants")
const socket = require("./socket.js")

module.exports.sendMessage = async function(req, res){
    try{
        let messageObj = {
            text: req.body.text,
            groupId: req.body.groupId,
            userId: req.body.userId,
        }
        let message = await chatDao.addMessage(messageObj)
        let user = await getUserByOid(req.body.userId)
        message = JSON.parse( JSON.stringify(message) )
        message.userName = user.name
        socket.emit("send-message", message)
        res.status(STATUS_CODE.OK).json({ success: true })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json({})
    }
}

module.exports.getMessages = async function(req, res){
    try{
        let messages = await chatDao.getMessageByGroupId(req.query.groupId)
        res.status(STATUS_CODE.OK).json({ success: true, messages })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json({})
    }
}