import * as React from 'react'
import {Switch, Route} from 'react-router-dom'
import {useReim} from 'react-reim'
import {Button} from 'reakit'

import {init as initAuth, logout} from './effects/auth'
import auth$ from './stores/auth'
import Login from './pages/Login'
import Brand from './pages/Brand'

function App() {
  const [authenticated] = useReim(auth$, {filter: s => !!s.user})
  React.useEffect(() => {initAuth()}, [])
  
  return (
    <Switch>
      <Route path="/login" component={Login}/>
      <Route>
        <div className={'wrapper'}>
          <div className={'container'}>
            {authenticated && (
              <Button onClick={logout}>Logout</Button>
            )}
            <Switch>
              <Route path="/brands/:id?" component={Brand}/>
            </Switch>
          </div>
        </div>
      </Route>
    </Switch>
  )
}

export default App
