const userDao= require("../dao/user")
const { STATUS_CODE } = require("../helper/constants")

module.exports.createUser = async function(req, res){
    try{
        console.log('to create user', req.body)
        req.body.userData.userName = req.body.userData.userName.toLowerCase()
        let user = await userDao.createUser(req.body.userData)
        console.log('craetedf user', user)
        res.status(STATUS_CODE.OK).json({ success: true })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json({ err })
    }
}

module.exports.checkUniqueUserName = async function(req, res){
    try{
        let user
        user = await userDao.checkUserName( req.query.userName, req.query._id )
        res.status(STATUS_CODE.OK).json({ success: true, available: user?false:true })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json({})
    }
}