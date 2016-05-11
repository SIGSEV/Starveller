import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import repos from 'core/reducers/repos'
import loader from 'core/reducers/loader'
import timers from 'core/reducers/timers'
import messages from 'core/reducers/messages'

export default combineReducers({
  routing,
  loader,
  repos,
  timers,
  messages
})
