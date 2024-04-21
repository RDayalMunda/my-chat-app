const model = require("../model/index.js")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

module.exports.addMessage = async function (data) {
    let messsage = await model.Message(data)
    await messsage.save()
    return messsage
}

module.exports.getMessageByGroupId = async function (groupId) {
    return await model.Message.aggregate([
        { $match: { groupId: new ObjectId(groupId) } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
            }
        },
        { $unwind: "userData" },
        {
            $project: {
                _id: true, text: true, userId: true, groupId: true, createdAt: true,
                userName: "$userData.name",
            }
        },
    ])
}