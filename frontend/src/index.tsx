import * as React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'reakit'

import * as system from './system'
import App from './App'

render(
  <Provider unstable_system={system}>
    <Router>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('app')
)
