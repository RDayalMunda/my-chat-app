const { STATUS_CODE } = require("../helper/constants")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

module.exports.getGroupList = async function(req, res){
    try{
        console.log('to get group list', req.query)
        let groupList = [
            { _id: new ObjectId(), name: "Ajay", lastMessage: "Kaha hai", lastMessageTime: new Date(), unseenCount: 4,  },
            { _id: new ObjectId(), name: "Nidhi", lastMessage: "aba kya plan hai", lastMessageTime: new Date(), unseenCount: 2,  },
            { _id: new ObjectId(), name: "Aditi", lastMessage: "bhool mat jana", lastMessageTime: new Date(), unseenCount: 1,  },
            { _id: new ObjectId(), name: "Shreya", lastMessage: "pakka na!", lastMessageTime: new Date(), unseenCount: 0,  },
            { _id: new ObjectId(), name: "Liz", lastMessage: "Dekhte h", lastMessageTime: new Date(), unseenCount: 1,  },
            { _id: new ObjectId(), name: "Neha", lastMessage: "ao game me hi hai", lastMessageTime: new Date(), unseenCount: 0,  },
            { _id: new ObjectId(), name: "Priya", lastMessage: "4v4 me hara diye re", lastMessageTime: new Date(), unseenCount: 0,  },
            { _id: new ObjectId(), name: "Prerna", lastMessage: "tk", lastMessageTime: new Date(), unseenCount: 1,  },
            { _id: new ObjectId(), name: "Diya", lastMessage: "aaj ana yaad se", lastMessageTime: new Date(), unseenCount: 3,  },
        ]
        res.status(STATUS_CODE.OK).json({ success: true, groupList })
    }catch(err){
        console.log(err)
        res.status( STATUS_CODE.ERROR ).json(err)
    }
}