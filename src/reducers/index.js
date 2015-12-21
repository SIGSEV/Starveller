import { combineReducers } from 'redux'
import { routerStateReducer as router } from 'redux-router'

import repos from './repos'
import loader from './loader'

export default combineReducers({
  router,
  repos,
  loader
})
