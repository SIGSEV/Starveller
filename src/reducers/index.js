import { combineReducers } from 'redux'
import { routerStateReducer as router } from 'redux-router'

import repos from 'reducers/repos'
import loader from 'reducers/loader'

export default combineReducers({
  router,
  loader,
  repos
})
