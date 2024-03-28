const bcrypt = require("bcrypt")
const path = require("path")

const { SALT_ROUNDS, IMAGE_UPLOAD_DIR } = require("../config")
const userDao= require("../dao/user")
const { STATUS_CODE } = require("../helper/constants")
const { deleteFile } = require("../helper/utils")

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

module.exports.uploadProfileImage = async function(req, res){
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        let oldImagePath = path.join( IMAGE_UPLOAD_DIR, req.body.oldImageUrl )
        await userDao.updateUser( { _id: req.body.userId }, { imageUrl: req.file.filename } )
        res.status(STATUS_CODE.OK).json({ success: true, imageUrl: req.file.filename })
        deleteFile( oldImagePath )
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.OK ).json({ success: false })
    }
}