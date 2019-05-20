import {effect} from 'reim'
import * as cookie from 'js-cookie'

import axios from '../services/axios'
import auth$ from '../stores/auth'

export const init = effect('init auth', async () => {
  if (cookie.get('shopless-token')) {
    try {
      const {user} = (await axios.get(`users`)).data
      auth$.login(user)
      return user
    } catch (err) {
      if (err.response && err.respons.status === 403) {
        return logout()
      }
      throw err
    }
  }
})

export const loginWithToken = effect('login oauth', async (token: string) => {
  cookie.set('shopless-token', token)
  const {user} = (await axios.get(`users`)).data
  auth$.login(user)
  return user
})

export const logout = effect('logout', () => {
  cookie.remove('shopless-token')
  auth$.logout()
  return true
})
