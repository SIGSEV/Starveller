import { createAction } from 'redux-actions'

export const loadFeatured = createAction('FEATURED_LOADING')
export const loadTrending = createAction('TRENDING_LOADING')
export const loadRepos = createAction('REPOS_LOADING')

export const featuredFinished = createAction('FEATURED_FINISHED')
export const trendingFinished = createAction('TRENDING_FINISHED')
export const reposFinished = createAction('REPOS_FINISHED')

export const repoProgress = createAction('REPO_PROGRESS', data => data)

export const askRepoStart = createAction('ASK_REPO_START')
export const askRepoFinish = createAction('ASK_REPO_FINISH')
