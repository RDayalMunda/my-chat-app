const model = require("../model/index.js");


module.exports.getUserByUsername = async function (userName){
    return await model.User.findOne({ userName: userName })
}