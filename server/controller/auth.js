const { SALT_ROUNDS } = require("../config")
const userDao= require("../dao/user")
const { STATUS_CODE } = require("../helper/constants")
const bCrypt = require("bcrypt") 

module.exports.login = async function(req, res){
    try{
        let responseObj = {}
        if ( !req.body.userName || !req.body.password ){
            responseObj = { success: false, message: "Invalid Credentials" }
        }else{
            let userData = await userDao.getUserByUsername(req.body.userName)
            if (!userData){
                responseObj = { success: false, message: "No user with this name" }
            }else{
                let isMatch = await bCrypt.compare( req.body.password, userData.password )
                if (!isMatch) {
                    responseObj = { success: false, message: "Invalid password" }
                }else responseObj = { success: true, session: userData };
    
            }
        }
        res.status(STATUS_CODE.OK).json(responseObj)
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json(err)
    }
}
