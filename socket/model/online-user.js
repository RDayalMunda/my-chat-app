const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        userId: ObjectId,
        socketId: String,
    }
], { timestamps: true })

const name = "OnlineUser"
module.exports = { collectionSchema, name }