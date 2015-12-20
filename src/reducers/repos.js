import { handleActions } from 'redux-actions'

export default handleActions({

  REPOS_FETCHED: (state, { payload }) => payload

}, [])
