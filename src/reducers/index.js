import { combineReducers } from 'redux'
import { routerStateReducer as router } from 'redux-router'

import repos from 'reducers/repos'
import loader from 'reducers/loader'
import timers from 'reducers/timers'
import messages from 'reducers/messages'

export default combineReducers({
  router,
  loader,
  repos,
  timers,
  messages
})
