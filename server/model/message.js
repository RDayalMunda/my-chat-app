const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        text: String,
        userId: ObjectId,
        groupId: ObjectId,
    }
], { timestamps: true })

const name = "Message"
module.exports = { collectionSchema, name }