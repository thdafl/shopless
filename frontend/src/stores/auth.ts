import reim from 'reim'

interface State {
  user: any
}

const state: State = {
  user: null
}

const store = reim(
  state,
  {
    actions: {
      login: user => state => {state.user = (user[0] || user)},
      logout: () => state => {state.user = null}
    }
  })

export default store
