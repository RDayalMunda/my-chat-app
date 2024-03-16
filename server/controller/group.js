const { STATUS_CODE } = require("../helper/constants")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

module.exports.getGroupList = async function(req, res){
    try{
        console.log('to get group list', req.query)
        let groupList = [
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Ram", lastMessage: "Hey there", lastMessageTime: new Date(), unseenCount: 4,  },
        ]
        res.status(STATUS_CODE.OK).json({ success: true, groupList })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json(err)
    }
}