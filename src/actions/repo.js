import r from 'superagent'
import { createAction } from 'redux-actions'

import config from 'config'

const { apiPort, apiUrl } = config
const api = `http://localhost:${apiPort}${apiUrl}`

const repoFetch = createAction('REPO_FETCH')
const repoFetched = createAction('REPO_FETCHED')
const repoFail = createAction('REPO_FAIL')

export const fetchRepo = (search) => dispatch => new Promise((resolve, reject) => {

  dispatch(repoFetch())

  r.get(`${api}/repos/${search}`)
    .end((err, res) => {
      if (err) {
        dispatch(repoFail())
        return reject(err)
      }
      dispatch(repoFetched(res.body))
    })

})
