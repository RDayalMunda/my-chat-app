const requestController = require('../controller/request')

const router = require('express').Router()


router.post("", requestController.sendFriendRequest)


module.exports = router