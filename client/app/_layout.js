import { Stack } from "expo-router"
import io from "socket.io-client"
import { CLIENT_ORIGIN, CLIENT_PORT } from "../config"


export default function () {
    return (
        <Stack />
    )
}


global.socket = io(`${CLIENT_ORIGIN}:${CLIENT_PORT}`)
global.reconnectSocket = ( query )=>{
    global.socket.disconnect()
    global.socket = io(`${CLIENT_ORIGIN}:${CLIENT_PORT}` , { query })
    return global.socket
}
global.socket.on('connect', () => {
    console.log('socket connected!')
})
global.socket.on("disconnect", () => {
    console.log("socket disconnected")
})