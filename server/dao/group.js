const model = require("../model/index.js");
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


module.exports.getGroupList = async function (userId) {
    return await model.Group.aggregate([
        { $match: {
            participants: new ObjectId(userId)
        } },
        {
            $lookup: {
                from: "users",
                localField: "participants",
                foreignField: "_id",
                as: "participants",
            }
        },
        {
            $addFields: {
                "participants": {
                    $map: {
                        input: "$participants",
                        as: "item",
                        in: {
                            _id: "$$item._id",
                            name: "$$item.name",
                            imageUrl: "$$item.imageUrl",
                        }
                    }
                }
            }
        }
    ])
}