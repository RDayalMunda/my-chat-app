const fs = require("fs")


module.exports.deleteFile = async function (filepath){
    try{
        fs.unlink( filepath, (err, data)=>{
            if (err){
                console.log('Error cb while deleteing File:', filepath)
                console.log(err)
            }
        } )
    }catch(err){
        console.log('Error while deleteing File:', filepath)
        console.log(err)
    }
    return undefined
}