import axios from 'axios'
import * as cookie from 'js-cookie'

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: cookie.get('shopless-token')
})

export default instance
