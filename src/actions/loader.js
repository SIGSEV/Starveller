import { createAction } from 'redux-actions'

export const startLoader = createAction('START_LOADER', name => name)
export const stopLoader = createAction('STOP_LOADER', name => name)
