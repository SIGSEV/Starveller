import _ from 'lodash'
import { handleActions } from 'redux-actions'

const state = {

  current: [],
  featured: [],

  all: {}

}

export default handleActions({

  // Reset the 'current' list

  RESET_CURRENT: state => ({
    ...state,
    current: []
  }),

  // Reset the 'current' list to a single repo

  SET_CURRENT: (state, { payload: repo }) => {
    return {
      ...state,
      current: [repo._id],
      all: {
        ...state.all,
        [repo._id]: {
          ...state.all[repo._id] || {},
          ...repo
        }
      }
    }
  },

  // Set featured repos, adding them to all list

  FEATURED_FETCHED: (state, { payload: repos }) => {
    return {
      ...state,
      featured: repos.map(r => r._id),
      all: {
        ...state.all,
        ..._.keyBy(repos, '_id')
      }
    }
  },

  // Add some repos to cache

  REPOS_FETCHED: (state, { payload: repos }) => ({
    ...state,
    all: _.merge({}, state.all, _.keyBy(repos, '_id'))
  }),

  // Enrich a repo

  REPO_RESOLVED: (state, { payload: repo }) => {
    return {
      ...state,
      all: {
        ...state.all,
        [repo._id]: {
          ...state.all[repo._id] || {},
          ...repo
        }
      }
    }
  },

  REPO_DELETED: (state, { payload: repoId }) => {
    const deleteIfIn = list => {
      if (_.find(list, repoId)) {
        return list.filter(list, id => id !== repoId)
      }
      return list
    }

    return {
      current: deleteIfIn(state.current),
      featured: deleteIfIn(state.featured),
      all: _.omit(state.all, repoId)
    }
  },

  REPO_SELECTED: (state, { payload: repo }) => ({
    ...state,
    current: [
      ...state.current,
      repo._id
    ]
  }),

  REPO_DESELECTED: (state, { payload: repo }) => ({
    ...state,
    current: state.current.filter(r => r !== repo._id)
  })

}, state)
