import r from 'superagent'
import { pushState } from 'redux-router'
import { createAction } from 'redux-actions'

import config from 'config'

const api = config.getApi()

/**
 * Fetch a single repo
 */

const repoFetch = createAction('REPO_FETCH', basicRepo => basicRepo)
const repoFetched = createAction('REPO_FETCHED')
export const repoResolved = createAction('REPO_RESOLVED')

export const fetchRepo = basicRepo => dispatch => new Promise((resolve, reject) => {

  const { name } = basicRepo

  dispatch(repoFetch(basicRepo))

  r.get(`${api}/repos/${name}`)
    .end((err, res) => {
      if (err) { return reject(err) }
      dispatch(repoFetched(res.body))
      resolve()
    })

})

export const askRepo = name => dispatch => new Promise((resolve, reject) => {

  r.post(`${api}/repos`)
    .send({ name })
    .end((err, res) => {
      if (err) { return reject(err) }
      dispatch(repoResolved(res.body))
      resolve()
    })

})

/**
 * Reset the current repo
 */

export const resetRepo = createAction('REPO_RESET')

/**
 * Fetch a basic list of repos
 */

const reposListFetched = createAction('REPOS_LIST_FETCHED')

export const fetchReposList = () => dispatch => new Promise((resolve, reject) => {

  r.get(`${api}/repos`)
    .end((err, res) => {
      if (err) { return reject(err) }
      dispatch(reposListFetched(res.body))
      resolve()
    })

})

/**
 * Fetch a repo, then navigate to its page
 */

export const fetchAndGo = (repo) => dispatch => {

  dispatch(fetchRepo(repo))
    .then(() => { dispatch(pushState(null, `${repo.name}`)) })

}

/**
 * Add a repo to builder
 */

export const chosenChoose = createAction('CHOSEN_CHOOSE')
