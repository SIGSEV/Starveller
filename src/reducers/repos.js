import _ from 'lodash'
import { handleActions } from 'redux-actions'

const state = {

  current: [],
  trending: [],

  all: {}

}

export default handleActions({

  // Reset the 'current' list to a single repo

  SET_CURRENT: (state, { payload: repo }) => {
    return {
      ...state,
      current: [repo._id],
      all: {
        ...state.all,
        [repo._id]: repo
      }
    }
  },

  // Set trending repos, adding them to all list

  TRENDING_FETCHED: (state, { payload: repos }) => {
    return {
      ...state,
      trending: repos.map(r => r._id),
      all: {
        ...state.all,
        ..._.indexBy(repos, '_id')
      }
    }
  },

  // Enrich a repo

  REPO_RESOLVED: (state, { payload: repo }) => {
    return {
      ...state,
      all: {
        ...state.all,
        [repo._id]: repo
      }
    }
  }

}, state)
