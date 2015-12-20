import { combineReducers } from 'redux'
import { routerStateReducer as router } from 'redux-router'

import repo from './repo'
import repos from './repos'

export default combineReducers({
  router,
  repo,
  repos
})
