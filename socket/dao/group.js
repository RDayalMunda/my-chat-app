const model = require("../model/index.js")

module.exports.getGroupDataById = async function ( _id ){
    return await model.Group.findOne( { _id } )
}