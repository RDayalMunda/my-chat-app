const userController = require('../controller/user')

const router = require('express').Router()

router.post("", userController.createUser)
router.get("/unique", userController.checkUniqueUserName)


module.exports = router