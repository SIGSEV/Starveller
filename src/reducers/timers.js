import { handleActions } from 'redux-actions'

const state = {

  trending: new Date(0),
  all: new Date(0)

}

export default handleActions({

  REPOS_FETCHED: state => ({
    ...state,
    all: new Date()
  }),

  TRENDING_FETCHED: state => ({
    ...state,
    trending: new Date()
  })

}, state)
