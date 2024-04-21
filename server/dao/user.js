const model = require("../model/index.js");


module.exports.getUserByOid = async function (_id){
    return await model.User.findOne({ _id  })
}

module.exports.getUserByUsername = async function (userName) {
    return await model.User.findOne({ userName: userName })
}

module.exports.checkUserName = async function (userName, userId) {
    return model.User.findOne({ userName, ...(userId?{_id: userId}:{}) })
}

module.exports.createUser = async function(userData){
    let user = await model.User(userData)
    await user.save()
    return user
}

module.exports.updateUser = async function(query, setData ){
    return await model.User.updateOne( query, { $set: setData } )
}

module.exports.updateAndFetchUser = async function(query, setData){
    return await model.User.findOneAndUpdate( query, { $set: setData }, { new: true } )
}