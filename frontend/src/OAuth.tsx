import * as React from 'react'
import * as FontAwesome from 'react-fontawesome'

import {API_URL} from './config'

export interface OAuthProps {
  socket: SocketIOClient.Socket,
  provider: string
}

export interface OAuthState {
  user: any,
  disabled: boolean
}

export default class OAuth extends React.Component<OAuthProps, OAuthState> {
  popup: Window | null = null
  
  state: OAuthState = {
    user: {},
    disabled: false
  }

  componentDidMount() {
    const { socket, provider } = this.props

    socket.on(provider, (user: any) => {
      if (this.popup) {
        this.popup.close()
      }
      this.setState({user})
    })
  }

  // Routinely checks the popup to re-enable the login button 
  // if the user closes the popup without authenticating.
  checkPopup() {
    const check = setInterval(() => {
      const { popup } = this
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check)
        this.setState({disabled: false})
      }
    }, 1000)
  }
  
  // Launches the popup by making a request to the server and then 
  // passes along the socket id so it can be used to send back user 
  // data to the appropriate socket on the connected client.
  openPopup() {
    const { provider, socket } = this.props
    const width = 600, height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
    const url = `${API_URL}/${provider}?socketId=${socket.id}`

    return window.open(url, '',       
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    )
  }

  // Kicks off the processes of opening the popup on the server and listening 
  // to the popup. It also disables the login button so the user can not 
  // attempt to login to the provider twice.
  startAuth: React.MouseEventHandler = e => {
    if (!this.state.disabled) {
      e.preventDefault()
      this.popup = this.openPopup()  
      this.checkPopup()
      this.setState({disabled: true})
    }
  }

  closeCard() {
    this.setState({user: {}})
  }

  render() {
    const { name, photo} = this.state.user
    const { provider } = this.props
    const { disabled } = this.state
    
    return (
      <div>
        {name
          ? <div className={'card'}>              
              <img src={photo} alt={name} />
              {/* <FontAwesome
                name={'times-circle'}
                className={'close'}
                onClick={this.closeCard.bind(this)}
              /> */}
              <button onClick={this.closeCard.bind(this)}>Close</button>
              <h4>{name}</h4>
            </div>
          : <div className={'button-wrapper fadein-fast'}>
              <button 
                onClick={this.startAuth.bind(this)} 
                className={`${provider} ${disabled ? 'disabled' : ''} button`}
                style={{width: 100, height: 100}}
              >
                {provider}
                {/* <FontAwesome
                  name={provider}
                /> */}
              </button>
            </div>
        }
      </div>
    )
  }
}
