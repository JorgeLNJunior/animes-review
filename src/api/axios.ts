import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.API_URL as string
})
