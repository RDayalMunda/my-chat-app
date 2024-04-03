const mongoose = require("mongoose");


const model = require("../model/index.js");
const ObjectId = mongoose.Types.ObjectId;


module.exports.submitRequest = async function (data) {
    let request = await model.Request(data)
    await request.save()
    return request
}

module.exports.getRequestByReceiverId = async function(targetId){
    let value = targetId
    if (typeof value == 'string' && value) {
        value = new ObjectId(value)
    }
    return model.Request.aggregate([
        { $match: {
            targetId: value
        } },
        { $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "senderName"
        } },
        { $unwind: "$senderName" },
        { $addFields: {
            senderName: "$senderName.name"
        } }
    ])
}