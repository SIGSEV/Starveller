import { handleActions } from 'redux-actions'

const initial = {

  trending: false,
  repos: false,
  progress: {}

}

export default handleActions({

  TRENDING_LOADING: state => ({ ...state, trending: true }),
  TRENDING_FINISHED: state => ({ ...state, trending: false }),

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
