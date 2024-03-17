const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const collectionSchema = mongoose.Schema([
    {
        name: String,
    }
])

const name = "User"
module.exports = { collectionSchema, name }