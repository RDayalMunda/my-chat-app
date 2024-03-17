const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        name: String,
        username: String,
        password: String,
        imageUrl: String,
    }
])

const name = "User"
module.exports = { collectionSchema, name }