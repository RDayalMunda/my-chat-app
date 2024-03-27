const model = require("../model/index.js");


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