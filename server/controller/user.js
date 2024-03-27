const bcrypt = require("bcrypt")

const { SALT_ROUNDS } = require("../config")
const userDao= require("../dao/user")
const { STATUS_CODE } = require("../helper/constants")

module.exports.createUser = async function(req, res){
    try{

        let salt = bcrypt.genSaltSync(SALT_ROUNDS)
        let hashedPassword = bcrypt.hashSync( req.body.userData.password, salt )
        req.body.userData.password = hashedPassword

        let user = await userDao.createUser(req.body.userData)

        res.status(STATUS_CODE.OK).json({ success: true, userName: user.userName })
    }catch(err){
        console.log(err)
        res.status( err.code==11000?STATUS_CODE.OK:STATUS_CODE.ERROR ).json({ success: false, code: err.code, message: err.code==11000?'User name is already taken':'' })
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