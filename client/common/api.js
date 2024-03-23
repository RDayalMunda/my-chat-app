import axios from "axios"

export const CLIENT_ORIGIN = "http://192.168.82.212"
export const CLIENT_PORT = 3081;
export const SOCKET_URL = "http://192.168.82.212:3081"
export const SERVER_URL = "http://192.168.82.212:3081/api"
export const IMAGE_URL = "http://192.168.82.212:3081/images"


const api = axios.create({ baseURL: SERVER_URL })

export default api