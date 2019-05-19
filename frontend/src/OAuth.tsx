import * as React from 'react'
import * as querystring from 'querystring'
import * as cookie from 'js-cookie'
import {State} from 'react-reim'
import {Button} from 'reakit'

import {loginWithToken} from './effects/auth'
import auth$ from './stores/auth'

export interface OAuthProps {
  socket: SocketIOClient.Socket,
  provider: string
}

export interface OAuthState {
  disabled: boolean
}

export default class OAuth extends React.Component<OAuthProps, OAuthState> {
  popup: Window | null = null
  
  state: OAuthState = {
    disabled: false
  }

  async componentDidMount() {
    const {socket} = this.props

    socket.on('jwt', async ({token}: {token: string}) => {
      if (this.popup) {
        this.popup.close()
      }
      await loginWithToken(token)
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
      } else {
        try {
          const {token} = querystring.parse(this.popup!.location.search.slice(1))
          if (!token) {
            return
          }
          cookie.set('shopless-token', token)
          clearInterval(check)
          this.setState({disabled: false})
          this.popup!.close()
        } catch {}
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
    const url = `${process.env.API_URL}/${provider}?socketId=${socket.id}`

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

  closeCard() {}

  render() {
    const { provider } = this.props
    const { disabled } = this.state
    
    return (
      <div>
        <State store={auth$} filter={s => (s.user ? s.user[provider] : null)}>
          {profile =>
            profile
              ? <div className={'card'}>              
                  <img src={profile.photos[0].value} alt={profile.displayName} />
                  {/* <FontAwesome
                    name={'times-circle'}
                    className={'close'}
                    onClick={this.closeCard.bind(this)}
                  /> */}
                  <button onClick={this.closeCard.bind(this)}>Close</button>
                  <h4>{profile.displayName}</h4>
                </div>
              : <div className={'button-wrapper fadein-fast'}>
                  <Button
                    onClick={this.startAuth.bind(this)} 
                    className={`${provider} ${disabled ? 'disabled' : ''} button`}
                    style={{width: 100, height: 100}}
                  >
                    {provider}
                    {/* <FontAwesome
                      name={provider}
                    /> */}
                  </Button>
                </div>
          }
        </State>
      </div>
    )
  }
}
