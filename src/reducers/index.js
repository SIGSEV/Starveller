import { combineReducers } from 'redux'
import { routerStateReducer as router } from 'redux-router'

import repos from './repos'

export default combineReducers({
  router,
  repos
})
