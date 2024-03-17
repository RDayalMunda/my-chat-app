const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        name: String,
        lastMessage: String,
        lastModifiedTime: Date,
        participants: [ ObjectId ],
        lastMessageTime: Date,
        unseenCount: Number,
    }
])

const name = "Group"
module.exports = { collectionSchema, name }