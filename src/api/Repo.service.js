import q from 'q'
import r from 'superagent'
import _ from 'lodash'

import Repo from 'api/Repo.model'

export const getByName = name => {
  return q.nfcall(Repo.findOne.bind(Repo), { name })
    .then(repo => {
      if (!repo) { return create(name) }
      return repo
    })
}

export const updateById = (_id, mods) => {
  return q.nfcall(Repo.update.bind(Repo), { _id }, mods)
    .then(() => null)
}

export const create = name => {
  return q.nfcall(Repo.create.bind(Repo), { name })
}

export const fetch = (name, hard) => {

  let _repo

  return getByName(name)
    .then(repo => {
      _repo = repo
      process.stdout.write('[')
      return fetchPage(name, hard ? 1 : _repo.lastPage)
    })
    .then(results => {
      process.stdout.write(']\n')
      const stars = _.reject(_repo.stars, { page: _repo.lastPage }).concat(results)
      const lastPage = Math.ceil(stars.length / 100)
      return updateById(_repo._id, { stars, lastPage })
    })
}

function fetchPage (name, page) {

  const githubToken = process.env.GITHUB

  return q.Promise((resolve, reject) => {

    process.stdout.write(':')

    r.get(`https://api.github.com/repos/${name}/stargazers?page=${page}&per_page=100`)
      .set('Authorization', `token ${githubToken}`)
      .set('Accept', 'application/vnd.github.v3.star+json')
      .end((err, res) => {
        if (err) { return reject(err) }

        const stars = res.body.map(star => ({ date: star.starred_at, page }))

        if (res.body.length === 100) {
          return fetchPage(name, ++page)
            .then(data => { resolve(data.concat(stars)) })
            .catch(reject)
        }

        resolve(stars)
      })

  })

}
