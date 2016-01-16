import { generate } from 'shortid'
import { createAction } from 'redux-actions'

export const removeMessage = createAction('REMOVE_MESSAGE')

const add = createAction('ADD_MESSAGE')

export const addMessage = ({ data, type }) => dispatch => {

  if (['error', 'warning', 'info'].indexOf(type) === -1) { return }

  const id = generate()
  const timer = setTimeout(dispatch.bind(this, removeMessage(id)), 10e3)

  dispatch(add({ type, data, id, timer }))

}
