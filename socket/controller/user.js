module.exports = function userController(socket){
    socket.on("logged-in", (data)=>{
        console.log('logged-in', socket.id, data)
    })
    socket.on("logged-out", (data)=>{
        console.log('logged-out', socket.id,data)
    })
}