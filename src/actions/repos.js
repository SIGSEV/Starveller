import r from 'superagent'
import { pushState } from 'redux-router'
import { createAction } from 'redux-actions'

import config from 'config'

import { startLoader, stopLoader } from 'actions/loader'

const api = config.getApi()

/**
 * Fetch a single repo
 */

const repoFetch = createAction('REPO_FETCH', basicRepo => basicRepo)
const repoFetched = createAction('REPO_FETCHED')

export const fetchRepo = basicRepo => dispatch => new Promise((resolve, reject) => {

  dispatch(startLoader('global'))

  const { name } = basicRepo
  dispatch(repoFetch(basicRepo))

  r.get(`${api}/repos/${name}`)
    .end((err, res) => {
      dispatch(stopLoader('global'))
      if (err) { return reject(err) }
      dispatch(repoFetched(res.body))
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
