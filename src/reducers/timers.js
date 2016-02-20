import { handleActions } from 'redux-actions'

const state = {

  featured: new Date(0),
  all: new Date(0)

}

export default handleActions({

  REPOS_FETCHED: state => ({
    ...state,
    all: new Date()
  }),

  FEATURED_FETCHED: state => ({
    ...state,
    featured: new Date()
  })

}, state)
