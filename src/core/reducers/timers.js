import { handleActions } from 'redux-actions'

const state = {

  home: new Date(0),
  all: new Date(0)

}

export default handleActions({

  REPOS_FETCHED: state => ({
    ...state,
    all: new Date()
  }),

  HOME_FETCHED: state => ({
    ...state,
    home: new Date()
  })

}, state)
