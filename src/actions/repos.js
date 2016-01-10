import r from 'superagent'
import { pushState } from 'redux-router'
import { createAction } from 'redux-actions'

import config from 'config'

const api = config.getApi()

/**
 * Get random repos
 */

const trendingFetched = createAction('TRENDING_FETCHED')

export const fetchTrendingRepos = () => dispatch => {
  return new Promise((resolve, reject) => {
    r.get(`${api}/random-repos`)
      .end((err, res) => {
        if (err) {
          return reject(err)
        }
        dispatch(trendingFetched(res.body))
        resolve()
      })
  })
}

/**
 * Clear repo cache
 */
export const deleteFromCache = repo => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    r.put(`${api}/repos/${repo._id}`)
      .end((err, res) => {
        if (err) { return reject(err) }
      })
  })
}

/**
 * Go to repo
 */
export const goToRepo = repo => dispatch => {
  dispatch(setCurrent(repo))
  dispatch(pushState(null, `${repo.name}`))
}

export const setCurrent = createAction('SET_CURRENT', repo => repo)

/**
 * Ask for a repo
 */
export const askRepo = repo => dispatch => new Promise((resolve, reject) => {
  if (repo.stars) { return resolve() }
  r.get(`${api}/repos/${repo.name}`)
    .end((err, res) => {
      if (err) { return reject(err) }
      const repo = res.body
      dispatch(repoResolved(repo))
      resolve(repo)
    })
})

export const askAndGo = repo => dispatch => {
  return dispatch(askRepo(repo))
    .then(repo => dispatch(goToRepo(repo)))
}

export const repoResolved = createAction('REPO_RESOLVED', repo => repo)
