const requestController = require('../controller/request')

const router = require('express').Router()


router.post("", requestController.sendFriendRequest)
router.get("/all", requestController.getAllRequests)


module.exports = router