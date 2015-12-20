import r from 'superagent'
import { createAction } from 'redux-actions'

import config from 'config'

const api = config.getApi()

const reposFetched = createAction('REPOS_FETCHED')

export const fetchRepos = () => dispatch => new Promise((resolve, reject) => {

  r.get(`${api}/repos`)
    .end((err, res) => {
      if (err) {
        return reject(err)
      }
      dispatch(reposFetched(res.body))
      resolve()
    })

})
