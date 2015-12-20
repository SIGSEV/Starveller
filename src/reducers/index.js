import { combineReducers } from 'redux'
import { routerStateReducer as router } from 'redux-router'

import repo from './repo'

export default combineReducers({
  router,
  repo
})
