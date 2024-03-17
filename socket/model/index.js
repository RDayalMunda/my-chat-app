const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

const model = {}

let files = fs.readdirSync( __dirname );
for( let i=0; i<files.length; i++ ){
    if (files[i]!='index.js'){
        const {collectionSchema, name} = require(path.join( __dirname, files[i] ));
        model[name] = new mongoose.model(name, collectionSchema)
    }
}

module.exports = model