import { handleActions } from 'redux-actions'

const state = {
  global: false
}

export default handleActions({

  START_LOADER: (state, { payload: loaderName }) => ({ ...state, [loaderName]: true }),
  STOP_LOADER: (state, { payload: loaderName }) => ({ ...state, [loaderName]: false })

}, state)
