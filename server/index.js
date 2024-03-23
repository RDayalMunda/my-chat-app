const express = require("express")
const CONFIG = require("./config.js")
const mongoose = require("mongoose")

const app = express()
const cors = require('cors')
app.use(cors())

app.use( (req, res, next)=>{
    console.log('server reached')
    next()
} )

require("./controller/socket.js")

app.use(express.json())

app.use('/auth', require("./router/auth.js"))
app.use("/group", require("./router/group.js"))
app.use("/chat", require("./router/chat.js"))

app.listen(CONFIG.PORT, () => {
    console.log(`chat app running on ${CONFIG.LOCALHOST}:${CONFIG.PORT}`)
    mongoose.connect(CONFIG.MDB.URL).then(() => {
        console.log('MDB connected')
    }).catch(err => {
        console.log('MDB connection FAILED!!')
    })
})