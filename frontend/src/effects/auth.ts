import {effect} from 'reim'
import * as cookie from 'js-cookie'

import apollo from '../services/apollo'
import auth$ from '../stores/auth'

import gql from 'graphql-tag'

export const init = effect('init auth', () => loginWithToken())

export const loginWithToken = effect('login oauth', async (token?: string) => {
  const tk = token || cookie.get('shopless-token')
  if (tk) {
    cookie.set('shopless-token', tk)
    try {
      const {me} = (await apollo.query({
        query: gql`
          {
            me {
              name,
              photo
            }
          }
        `
      })).data
      auth$.login(me)
      return me
    } catch (err) {
      if (err.response && err.respons.status === 403) {
        return logout()
      }
      throw err
    }
  }
})

export const logout = effect('logout', () => {
  cookie.remove('shopless-token')
  auth$.logout()
  return true
})
