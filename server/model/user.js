const mongoose = require("mongoose")
const collectionSchema = mongoose.Schema([
    {
        name: String,
        userName: { type: String, index: { unique: true, sparse: true } },
        password: String,
        imageUrl: String,
    }
], { timestamps: true })

const name = "User"
module.exports = { collectionSchema, name }