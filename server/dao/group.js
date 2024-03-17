const model = require("../model/index.js");


module.exports.getGroupList = async function(){
    return await model.Group.find()
}