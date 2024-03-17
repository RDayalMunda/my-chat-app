const groupController = require('../controller/group')

const router = require('express').Router()

router.get("/list", groupController.getGroupList)


module.exports = router