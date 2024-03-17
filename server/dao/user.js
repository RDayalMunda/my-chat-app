const model = require("../model/index.js");


module.exports.getUserByUsername = async function (username){
    return await model.User.findOne({ username: username })
}