import axios from "axios"

const api = axios.create({ baseURL: `http://192.168.105.212:3000` })

export default api