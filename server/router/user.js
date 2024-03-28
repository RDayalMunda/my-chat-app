const router = require('express').Router()
const multer = require("multer");
const path = require("path")



const userController = require('../controller/user');
const { IMAGE_UPLOAD_DIR } = require('../config');

var unique = 1
const storage = multer.diskStorage({
    destination: IMAGE_UPLOAD_DIR,
    filename: (req, file, cb)=>{
        const ext = path.extname(file.originalname);

        const uniqueFilename = `${Date.now()}${unique++}${ext}`;
        cb(null, uniqueFilename)
    }
})
const profileImageUpload = multer({ storage })


router.post("", userController.createUser)
router.get("/unique", userController.checkUniqueUserName)
router.post("/profile-image", profileImageUpload.single('file'), userController.uploadProfileImage)


module.exports = router