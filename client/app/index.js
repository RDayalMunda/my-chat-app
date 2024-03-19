import io from "socket.io-client"
import Home from "../components/home/home"
import { CLIENT_ORIGIN, CLIENT_PORT } from "../common/api"

export default function (){
    return (
        <Home />
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