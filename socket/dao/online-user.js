const model = require("../model/index.js")

module.exports.addSocket = async function( userId, socketId ){
    let mongoObj = await model.OnlineUser( { userId, socketId } )
    await mongoObj.save()
    return
}

module.exports.removeSocket = async function ( userId, socketId ){
    return await model.OnlineUser.deleteMany( { userId, socketId } )
}

module.exports.getAllSocketByUserId = async function(userId){
    return await model.OnlineUser.find( { userId } )
}