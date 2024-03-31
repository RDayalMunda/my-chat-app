const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        senderId: ObjectId, // this user is sending request to <targetId>
        targetId: ObjectId, // this user is receiving requests from <senderId>
        message: String,
    }
], { timestamps: true })


collectionSchema.index({
    senderId: 1,
    targetId: 1,
},{
    unique: true,
    name: "_uniqueRequest"
})

const name = "Request"
module.exports = { collectionSchema, name }