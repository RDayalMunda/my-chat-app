const groupController = require('../controller/group')

const router = require('express').Router()

router.get("", groupController.getGroupList)


module.exports = router