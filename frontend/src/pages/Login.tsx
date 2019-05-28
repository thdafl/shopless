import * as React from 'react'
import {useReim} from 'react-reim'
import * as querystring from 'querystring'
import {Redirect, RouteComponentProps} from 'react-router'

import auth$ from '../stores/auth'
import {socket} from '../services/socket'
import instance from '../services/axios'
import OAuth from '../OAuth'

const providers = ['google'/*, 'twitter', 'facebook', 'github'*/]

const LoginComponent = () => {
  const [username, setUsername] = React.useState("")
  const [name, setName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [toggleLogin, setToggleLogin] = React.useState(true)

  const loginFunction = (username: string, password: string): void => {
    try {
      instance.post('/local/login', {
        username,
        password
      })
        .then(res => alert(res.data.message))
    } catch (e) {
      console.log(e)
    }
  }

  const registerFunction = (username: string, name: string, password: string): void => {
    try {
      instance.post('/local/register', {
        username,
        name,
        password
      })
        .then(res => alert(res.data.message))
    } catch (e) {
      console.log(e)
    }
  }

  const verifyFunction = (): void => {
    try {
      instance.get('/verify')
        .then(res => console.log(res))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <React.Fragment>
      <div>
        {toggleLogin ? "Login" : "Register"}
        <button onClick={() => setToggleLogin(!toggleLogin)}>{!toggleLogin ? "Login" : "Register"}</button>
      </div>
      {toggleLogin
        ?
        (
          <form
            onSubmit={(e) => { loginFunction(username, password); e.preventDefault() }}
          >
            <div>username
            <input onChange={e => setUsername(e.target.value)} value={username} />
            </div>
            <div>password
            <input onChange={e => setPassword(e.target.value)} value={password} />
            </div>
            <button type='submit'>Login</button>
          </form>
        )
        :
        (
          <form
            onSubmit={(e) => { registerFunction(username, name, password); e.preventDefault() }}
          >
            <div>username
            <input onChange={e => setUsername(e.target.value)} value={username} />
            </div>
            <div>name
            <input onChange={e => setName(e.target.value)} value={name} />
            </div>
            <div>password
            <input onChange={e => setPassword(e.target.value)} value={password} />
            </div>
            <button type='submit'>Register</button>
          </form>
        )
      }
      <button onClick={verifyFunction}>Verify</button>
    </React.Fragment>
  )
}

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
          <LoginComponent />
        </>
  )
}

export default Login
