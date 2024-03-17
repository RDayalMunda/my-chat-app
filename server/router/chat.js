const router = require('express').Router()

const chatController = require("../controller/chat");

router.post("/message", chatController.sendMessage)

module.exports = router