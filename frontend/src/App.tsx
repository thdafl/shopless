import * as React from 'react'
import {Switch, Route} from 'react-router-dom'
import {Button} from 'reakit'

import Login from './pages/Login'
import {init as initAuth, logout} from './effects/auth';

function App() {
  React.useEffect(() => {initAuth()}, [])
  
  return (
    <div className={'wrapper'}>
      <div className={'container'}>
        <Button onClick={logout}>Logout</Button>
        <Switch>
          <Route path="/login" component={Login}/>
        </Switch>
      </div>
    </div>
  )
}

export default App
