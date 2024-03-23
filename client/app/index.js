import io from "socket.io-client"
import Home from "../components/home/home"
import { SOCKET_URL } from "../common/api"

export default function (){
    return (
        <Home />
    )
}


global.socket = io(SOCKET_URL)
global.reconnectSocket = ( query )=>{
    global.socket.disconnect()
    global.socket = io(SOCKET_URL , { query })
    global.socket.on('connect', () => {
        console.log('socket connected!')
    })
    global.socket.on("disconnect", () => {
        console.log("socket disconnected")
    })
    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
    return global.socket
}
global.socket.on('connect', () => {
    console.log('socket connected!')
})
global.socket.on("disconnect", () => {
    console.log("socket disconnected")
})
socket.on("error", (error) => {
    console.error("Socket error:", error);
});