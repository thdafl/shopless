import * as React from 'react'
import {useReim} from 'react-reim'
import * as querystring from 'querystring'
import {Redirect, RouteComponentProps} from 'react-router'

import auth$ from '../stores/auth'
import {socket} from '../services/socket'
import OAuth from '../OAuth'

const providers = ['google'/*, 'twitter', 'facebook', 'github'*/]

function Login({location}: RouteComponentProps<{}>) {
  const [authenticated] = useReim(auth$, {filter: s => !!s.user})
  const {token} = querystring.parse(location.search.slice(1))

  return (
    !!token ?
      null :
      authenticated ?
        <Redirect to={decodeURIComponent(querystring.parse(location.search.slice(1)).redirect as string || '')}/> :
        <>
          {providers.map(provider => 
            <OAuth 
              provider={provider}
              key={provider}
              socket={socket}
            />
          )}
        </>
  )
}

export default Login
