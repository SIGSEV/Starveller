import { handleActions } from 'redux-actions'

export default handleActions({

  REPO_FAIL: () => null,
  REPO_RESET: () => null,
  REPO_FETCHED: (state, action) => action.payload

}, null)
