const authController= require('../controller/auth')

const router = require('express').Router()

router.post("/login", authController.login)


module.exports = router