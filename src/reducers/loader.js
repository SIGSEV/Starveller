import { handleActions } from 'redux-actions'

const initial = {

  featured: false,
  repos: false,
  ask: false,
  progress: {}

}

export default handleActions({

  ASK_REPO_START: state => ({ ...state, ask: true }),
  ASK_REPO_FINISH: state => ({ ...state, ask: false }),

  FEATURED_LOADING: state => ({ ...state, featured: true }),
  FEATURED_FINISHED: state => ({ ...state, featured: false }),

  REPOS_LOADING: state => ({ ...state, repos: true }),
  REPOS_FINISHED: state => ({ ...state, repos: false }),

  REPO_PROGRESS: (state, { payload: { _id, value } }) => ({
    ...state,
    progress: {
      ...state.progress,
      [_id]: value
    }
  })

}, initial)
