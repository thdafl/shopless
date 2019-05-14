import * as React from 'react'
import * as io from 'socket.io-client'
import OAuth from './OAuth'
import {API_URL} from './config'
// import './App.css'
const socket = io(API_URL)
const providers = ['google'/*, 'twitter', 'facebook', 'github'*/]

function App() {
  return (
    <div className={'wrapper'}>
      <div className={'container'}>
        {providers.map(provider => 
          <OAuth 
            provider={provider}
            key={provider}
            socket={socket}
          />
        )}
      </div>
    </div>
  )
}

export default App
