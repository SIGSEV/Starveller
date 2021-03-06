import { findIndex } from 'lodash'
import { handleActions } from 'redux-actions'

export default handleActions({

  ADD_MESSAGE: (state, { payload: message }) => [...state, message].reverse().slice(0, 5).reverse(),

  REMOVE_MESSAGE: (state, { payload: id }) => {
    const index = findIndex(state, { id })
    if (index === -1) { return state }

    const { timer } = state[index]
    clearTimeout(timer)

    return [
      ...state.slice(0, index),
      ...state.slice(index + 1)
    ]
  }

}, [])
