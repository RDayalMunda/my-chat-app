const { SALT_ROUNDS } = require("../config")
const userDao= require("../dao/user")
const { STATUS_CODE } = require("../helper/constants")
const bCrypt = require("bcrypt") 

module.exports.login = async function(req, res){
    try{
        if ( !req.body.userName || !req.body.password ) throw "Invalid Credentials"
        let userData = await userDao.getUserByUsername(req.body.userName)
        if (!userData) throw "No user with this name"
        let isMatch = await bCrypt.compare( req.body.password, userData.password )
        if (!isMatch) throw "Invalid password"
        res.status(STATUS_CODE.OK).json({ success: true, session: userData })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json(err)
    }
}
