import { handleActions } from 'redux-actions'

const initial = {

  trending: false,
  repos: false

}

export default handleActions({

  TRENDING_LOADING: state => ({ ...state, trending: true }),
  TRENDING_FINISHED: state => ({ ...state, trending: false }),

  REPOS_LOADING: state => ({ ...state, repos: true }),
  REPOS_FINISHED: state => ({ ...state, repos: false })

}, initial)
