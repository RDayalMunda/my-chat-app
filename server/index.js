const express = require("express")
const app = express()
const CONFIG = require("./config.js")
const mongoose = require("mongoose")
const cors = require('cors')


app.use(cors())
app.use( express.json() )

app.use("/group", require("./router/group.js"))

app.listen( CONFIG.PORT, ()=>{
    console.log(`chat app running on http://localhost:${CONFIG.PORT}`)
    mongoose.connect( CONFIG.MDB.URL ).then( ()=>{
        console.log('MDB connected')
    }).catch(err=>{
        console.log('MDB connection FAILED!!')
    })
} )