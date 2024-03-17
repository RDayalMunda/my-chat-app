const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        name: String,
        userName: String,
        password: String,
        imageUrl: String,
    }
], { timestamps: true })

const name = "User"
module.exports = { collectionSchema, name }