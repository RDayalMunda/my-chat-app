import { Stack } from "expo-router"
import io from "socket.io-client"


export default function () {
    return (
        <Stack />
    )
}


global.socket = io("http://192.168.170.212:3081")
global.reconnectSocket = ( query )=>{
    global.socket.disconnect()
    global.socket = io("http://192.168.170.212:3081" , { query })
    return global.socket
}
global.socket.on('connect', () => {
    console.log('socket connected!')
})
global.socket.on("disconnect", () => {
    console.log("socket disconnected")
})