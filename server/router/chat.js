const router = require('express').Router()

const chatController = require("../controller/chat");

router.post("/message", chatController.sendMessage)
router.get("/messages", chatController.getMessages)

module.exports = router