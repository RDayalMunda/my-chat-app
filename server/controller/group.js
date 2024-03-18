const { STATUS_CODE } = require("../helper/constants")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const groupDao = require("../dao/group.js")

module.exports.getGroupList = async function(req, res){
    try{
        let groupList = await groupDao.getGroupList(req.headers.userid)
        res.status(STATUS_CODE.OK).json({ success: true, groupList })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json(err)
    }
}