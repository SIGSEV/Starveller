import _ from 'lodash'
import { handleActions } from 'redux-actions'

const state = {
  current: null,
  list: [],
  trending: [],
  chosen: []
}

export default handleActions({

  /**
   * Repo will fetch, set a basic preview into current repo
   */
  REPO_FETCH: (state, { payload: basicRepo }) => ({ ...state, current: basicRepo }),

  /**
   * Repo will fetch, set a basic preview into current repo
   */
  REPO_CACHE: (state, { payload: githubRepo }) => ({ ...state, list: [...state.list, githubRepo] }),

  /**
   * Fill the current repo
   */
  REPO_FETCHED: (state, { payload: current }) => ({ ...state, current }),

  /**
   * Get a full repo (usually by sockets)
   */
  REPO_RESOLVED: (state, { payload: repo }) => {

    const { list } = state

    const index = _.findIndex(list, '_id', repo._id)
    if (index === -1) { return { ...state, list: [...list, repo] } }

    const current = (state.current && state.current._id === repo._id)
      ? repo
      : state.current

    return {
      ...state,
      current,
      list: [
        ...list.slice(0, index),
        repo,
        ...list.slice(index + 1)
      ]
    }

  },

  /**
   * Reset the current repo
   */
  REPO_RESET: (state) => ({ ...state, current: null }),

  /**
   * Fill repos basic list (only a few props like name, starsCount, etc.)
   */
  REPOS_LIST_FETCHED: (state, { payload: list }) => ({
    ...state,
    list,
    trending: _.shuffle(list).slice(0, 4)
  }),

  CHOSEN_CHOOSE: (state, { payload: repo }) => ({
    ...state,
    chosen: [
      ...state.chosen,
      repo
    ]
  })

}, state)
