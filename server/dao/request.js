const model = require("../model/index.js");


module.exports.submitRequest = async function (data) {
    let request = await model.Request(data)
    await request.save()
    return request
}
