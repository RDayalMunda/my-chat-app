const express = require("express")
const CONFIG = require("./config.js")
const mongoose = require("mongoose")

const app = express()

app.use( (req, res, next)=>{
    res.setHeader("Access-Control-Allow-Headers", "*")
    next()
} )


app.use(express.json())

app.use('/auth', require("./router/auth.js"))
app.use("/group", require("./router/group.js"))
app.use("/chat", require("./router/chat.js"))
app.use("/user", require("./router/user.js"))
app.use("/request", require("./router/request.js"))

app.listen(CONFIG.PORT, () => {
    console.log(`chat app running on ${CONFIG.LOCALHOST}:${CONFIG.PORT}`)
    require("./controller/socket.js")
    mongoose.connect(CONFIG.MDB.URL).then(() => {
        console.log('MDB connected')
    }).catch(err => {
        console.log('MDB connection FAILED!!')
    })
})