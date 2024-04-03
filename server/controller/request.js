
const { STATUS_CODE } = require("../helper/constants")
const requestDao = require("../dao/request")
const { getUserByUsername } = require("../dao/user")

module.exports.sendFriendRequest = async function (req, res) {
    try {
        let user = await getUserByUsername(req.body.userName)
        if (!user?._id || user?._id == req.headers.userid) {
            res.status(STATUS_CODE.OK).json({
                success: false,
                message: "No user with this username"
            })
        } else {
            requestDao.submitRequest({
                senderId: req.headers.userid,
                targetId: user._id,
                message: req.body.message,
            }).then((data) => {
                res.status(STATUS_CODE.OK).json({
                    success: true,
                    message: "Your friend request has been send successfully!"
                })
            }).catch(err => {
                res.status(STATUS_CODE.OK).json({
                    success: false,
                    message: "You have already send a request to this user!"
                })
            })
        }

    } catch (err) {
        console.log(err)
        res.status(STATUS_CODE.ERROR).json()
    }
}


module.exports.getAllRequests = async function (req, res) {
    try{
        console.log('getting request', req.headers.userid)
        requestDao.getRequestByReceiverId(req.headers.userid).then( (requests)=>{
            res.status(STATUS_CODE.OK).json({ success: false, requests })
        } ).catch(err=>{
            throw err
        })
    }catch(err){
        console.log(err)
        res.status(STATUS_CODE.ERROR).json()
    }
}