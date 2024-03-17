const chatDao = require("../dao/chat")
const { STATUS_CODE } = require("../helper/constants")


module.exports.sendMessage = async function(req, res){
    try{
        let messageObj = {
            text: req.body.text,
            groupId: req.body.groupId,
            userId: req.body.userId,
        }
        let message = await chatDao.addMessage(messageObj)
        console.log('to send message via socket')
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