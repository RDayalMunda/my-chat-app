import axios from "axios"

export const CLIENT_ORIGIN = "http://rnchat.lovetocode.in"
export const CLIENT_PORT = 3081;
export const SOCKET_URL = "http://rnchat.lovetocode.in"
export const SERVER_URL = "http://rnchat.lovetocode.in/api"
export const IMAGE_URL = "http://rnchat.lovetocode.in/images"


const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json'
    }
} )

export default api