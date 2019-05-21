import * as React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'reakit'
import {ApolloProvider} from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

import apollo from './services/apollo'
import * as system from './system'
import App from './App'

render(
  <ApolloProvider client={apollo}>
    <ApolloHooksProvider client={apollo}>
      <Provider unstable_system={system}>
          <Router>
            <App/>
          </Router>
      </Provider>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('app')
)
