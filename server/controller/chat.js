const { STATUS_CODE } = require("../helper/constants")


module.exports.sendMessage = async function(req, res){
    try{
        console.log('to send message', req.body)
        res.status(STATUS_CODE.OK).json({ success: true })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json({})
    }
}