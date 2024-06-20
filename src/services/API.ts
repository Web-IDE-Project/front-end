import axios from 'axios'

const API = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  baseURL: 'http://localhost:8080',
  withCredentials: true,
})

export default API
