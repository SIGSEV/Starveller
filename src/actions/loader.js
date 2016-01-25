import { createAction } from 'redux-actions'

export const loadTrending = createAction('TRENDING_LOADING')
export const loadRepos = createAction('REPOS_LOADING')

export const trendingFinished = createAction('TRENDING_FINISHED')
export const reposFinished = createAction('REPOS_FINISHED')

export const repoProgress = createAction('REPO_PROGRESS', data => data)
