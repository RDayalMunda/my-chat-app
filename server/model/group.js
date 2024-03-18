const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        name: String,
        participants: [ ObjectId ],
        imageUrl: String,
        
        isDirect: Boolean, // if true-> it will have 2 participants // if false-> it is a group
        // if direct is true name should be generated dynamically

        
        lastMessageSender: ObjectId,
        lastMessage: String,
        lastModifiedTime: Date,
        lastMessageTime: Date,
        unseenCount: Number,

    }
])

const name = "Group"
module.exports = { collectionSchema, name }